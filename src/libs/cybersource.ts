import crypto from 'crypto';
import axios, { AxiosInstance } from 'axios';

// Cybersource API configuration
export interface CybersourceConfig {
    merchantID: string;
    merchantKeyId: string;
    merchantSecretKey: string;
    runEnvironment: string;
}

// Get configuration from environment variables
export const getCybersourceConfig = (): CybersourceConfig => {
    if (!process.env.CYBERSOURCE_MERCHANT_ID || 
        !process.env.CYBERSOURCE_API_KEY_ID || 
        !process.env.CYBERSOURCE_SECRET_KEY) {
        throw new Error('Missing Cybersource environment variables');
    }

    return {
        merchantID: process.env.CYBERSOURCE_MERCHANT_ID,
        merchantKeyId: process.env.CYBERSOURCE_API_KEY_ID,
        merchantSecretKey: process.env.CYBERSOURCE_SECRET_KEY,
        runEnvironment: process.env.CYBERSOURCE_RUN_ENVIRONMENT || 'apitest.cybersource.com'
    };
};

/**
 * Generate HTTP Signature for Cybersource authentication
 */
export const generateHttpSignature = (
    config: CybersourceConfig,
    method: string,
    resource: string,
    payload: string = ''
): { signature: string; signatureHeader: string; digest: string } => {
    const date = new Date().toUTCString();
    const digest = payload ? `SHA-256=${crypto.createHash('sha256').update(payload).digest('base64')}` : '';
    
    // Create signature string
    let signatureString = '';
    const headers: string[] = [];
    
    // Add headers based on method
    headers.push('host');
    signatureString += `host: ${config.runEnvironment}\n`;
    
    headers.push('date');
    signatureString += `date: ${date}\n`;
    
    headers.push('(request-target)');
    signatureString += `(request-target): ${method.toLowerCase()} ${resource}\n`;
    
    if (payload) {
        headers.push('digest');
        signatureString += `digest: ${digest}\n`;
    }
    
    headers.push('v-c-merchant-id');
    signatureString += `v-c-merchant-id: ${config.merchantID}`;
    
    // Generate signature
    const signatureBytes = crypto.createHmac('sha256', Buffer.from(config.merchantSecretKey, 'base64'))
        .update(signatureString)
        .digest('base64');
    
    // Create signature header
    const signatureHeader = `keyid="${config.merchantKeyId}", algorithm="HmacSHA256", headers="${headers.join(' ')}", signature="${signatureBytes}"`;
    
    return {
        signature: signatureBytes,
        signatureHeader,
        digest
    };
};

/**
 * Create Axios instance configured for Cybersource
 */
export const createCybersourceClient = (): AxiosInstance => {
    const config = getCybersourceConfig();
    const baseURL = `https://${config.runEnvironment}`;
    
    const client = axios.create({
        baseURL,
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'v-c-merchant-id': config.merchantID
        }
    });
    
    // Add request interceptor for HTTP Signature
    client.interceptors.request.use((request) => {
        const method = request.method?.toUpperCase() || 'GET';
        const resource = request.url || '';
        const payload = request.data ? JSON.stringify(request.data) : '';
        
        const { signatureHeader, digest } = generateHttpSignature(
            config,
            method,
            resource,
            payload
        );
        
        // Add signature headers
        request.headers['Signature'] = signatureHeader;
        request.headers['Date'] = new Date().toUTCString();
        request.headers['Host'] = config.runEnvironment;
        
        if (digest) {
            request.headers['Digest'] = digest;
        }
        
        return request;
    });
    
    return client;
};

/**
 * Generate Flex Microform capture context
 */
export const generateCaptureContext = async (targetOrigin: string): Promise<string> => {
    const client = createCybersourceClient();
    
    try {
        console.log('Requesting capture context from Cybersource...');
        console.log('Target Origin:', targetOrigin);
        
        const response = await client.post('/microform/v2/sessions', {
            targetOrigins: [targetOrigin],
            allowedCardNetworks: ['VISA', 'MASTERCARD', 'AMEX', 'DISCOVER'],
            clientVersion: 'v2.0'
        });
        
        console.log('Cybersource response status:', response.status);
        
        // The capture context is returned as a JWT string directly in response.data
        if (!response.data) {
            throw new Error('No data in response');
        }
        
        // If response.data is a string (the JWT), return it directly
        // If it's an object with captureContext property, return that
        const captureContext = typeof response.data === 'string' 
            ? response.data 
            : response.data.captureContext;
        
        if (!captureContext) {
            throw new Error('No capture context found in response');
        }
        
        console.log('Successfully received capture context (JWT)');
        return captureContext;
    } catch (error: any) {
        console.error('Failed to generate capture context:', error.response?.data || error.message);
        console.error('Full error:', error);
        
        if (error.response) {
            console.error('Response status:', error.response.status);
            console.error('Response headers:', error.response.headers);
            console.error('Response data:', JSON.stringify(error.response.data, null, 2));
        }
        
        throw new Error(`Failed to generate capture context: ${error.response?.data?.message || error.message}`);
    }
};

/**
 * Process zero-amount authorization
 */
export const processZeroAmountAuth = async (
    transientToken: string,
    bookingReference: string,
    customerInfo: {
        firstName: string;
        lastName: string;
        email: string;
    }
): Promise<any> => {
    const client = createCybersourceClient();
    
    const payload = {
        clientReferenceInformation: {
            code: bookingReference
        },
        processingInformation: {
            commerceIndicator: 'internet',
            authorizationOptions: {
                initiator: {
                    type: 'customer',
                    credentialStoredOnFile: false
                },
                authType: 'VERIFICATION'
            }
        },
        paymentInformation: {
            tokenizedCard: {
                transientTokenJwt: transientToken
            }
        },
        orderInformation: {
            amountDetails: {
                totalAmount: '0.00',
                currency: 'USD'
            },
            billTo: customerInfo
        }
    };
    
    try {
        const response = await client.post('/pts/v2/payments', payload);
        return response.data;
    } catch (error: any) {
        console.error('Zero-auth failed:', error.response?.data || error.message);
        throw error;
    }
};