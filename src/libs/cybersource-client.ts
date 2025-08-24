import axios from 'axios';
import toast from 'react-hot-toast';

// Declare Flex global object
declare global {
    interface Window {
        FLEX: any;
        Flex: any; // Alternative name
    }
}

export interface BookingData {
    checkinDate: Date | null;
    checkoutDate: Date | null;
    adults: number;
    children: number;
    numberOfDays: number;
    hotelRoomSlug: string;
}

export interface AuthorizationResponse {
    success: boolean;
    authorizationId?: string;
    status?: string;
    bookingDetails?: any;
    message?: string;
    error?: string;
    reason?: string;
}

export interface FlexToken {
    token: string;
    maskedPan: string;
    cardType: string;
    expirationMonth: string;
    expirationYear: string;
}

const waitForContainers = async (selectors: string[], timeoutMs = 8000): Promise<Record<string, HTMLElement>> => {
  const start = Date.now();
  return new Promise((resolve, reject) => {
    const found: Record<string, HTMLElement> = {} as any;
    const tick = () => {
      for (const sel of selectors) {
        if (!found[sel]) {
          const el = document.querySelector(sel) as HTMLElement | null;
          if (el) found[sel] = el;
        }
      }
      const allFound = selectors.every((s) => !!found[s]);
      if (allFound) return resolve(found);
      if (Date.now() - start > timeoutMs) return reject(new Error(`Containers not found: ${selectors.filter(s=>!found[s]).join(', ')}`));
      requestAnimationFrame(tick);
    };
    tick();
  });
};

/**
 * Initialize Flex Microform
 */
export const initializeFlexMicroform = async (): Promise<string> => {
    try {
        // Get capture context from our API
        const { data } = await axios.post('/api/cybersource/flex-token');
        
        if (!data.success || !data.captureContext) {
            throw new Error('Failed to get capture context');
        }
        
        console.log('Received capture context from server');
        return data.captureContext;
    } catch (error: any) {
        console.error('Failed to initialize Flex:', error);
        toast.error('Failed to initialize payment form');
        throw error;
    }
};

/**
 * Load Flex SDK script
 */
const loadFlexScript = (): Promise<void> => {
    return new Promise((resolve, reject) => {
        // Check if already loaded
        const existingScript = document.getElementById('cybersource-flex-sdk');
        if (existingScript) {
            existingScript.remove();
        }
        
        const script = document.createElement('script');
        script.id = 'cybersource-flex-sdk';
        script.src = 'https://testflex.cybersource.com/microform/bundle/v2.0/flex-microform.min.js';
        
        script.onload = () => {
            console.log('Flex SDK script loaded');
            // Give it time to initialize
            setTimeout(() => {
                if (typeof window.FLEX !== 'undefined') {
                    console.log('FLEX is available:', typeof window.FLEX);
                    resolve();
                } else if (typeof window.Flex !== 'undefined') {
                    // Sometimes it's exposed as Flex instead of FLEX
                    window.FLEX = window.Flex;
                    console.log('Flex is available (capitalized):', typeof window.Flex);
                    resolve();
                } else {
                    console.error('FLEX not found after script load');
                    reject(new Error('FLEX SDK not available after loading'));
                }
            }, 500); // Increased timeout
        };
        
        script.onerror = () => {
            console.error('Failed to load Flex SDK script');
            reject(new Error('Failed to load Flex SDK'));
        };
        
        document.head.appendChild(script);
    });
};

/**
 * Setup Flex Microform with provided capture context
 */
export const setupFlexMicroform = async (
    captureContext: string,
    onSuccess: (token: FlexToken) => void,
    onError: (error: any) => void
) => {
    try {
        // First ensure the script is loaded
        await loadFlexScript();
        
        // Now initialize the microform
        await initializeMicroform(captureContext, onSuccess, onError);
    } catch (error) {
        console.error('Failed to setup Flex Microform:', error);
        onError(error);
    }
};

/**
 * Initialize the Microform fields
 */
const initializeMicroform = async (
    captureContext: string,
    onSuccess: (token: FlexToken) => void,
    onError: (error: any) => void
) => {
    try {
        console.log('Starting microform initialization...');
        console.log('FLEX available:', typeof window.FLEX);
        
        // Create FLEX instance with capture context
        if (typeof window.FLEX !== 'function') {
            throw new Error('FLEX SDK not properly loaded');
        }
        
        const flex = new window.FLEX(captureContext);
        console.log('Flex instance created');
        
        // Ensure the containers exist in the DOM (avoids FIELD_LOAD_CONTAINER_SELECTOR race)
        await waitForContainers(['#card-number-container', '#card-cvv-container']);

        // Get theme
        const isDark = document.documentElement.classList.contains('dark');
        const css = getComputedStyle(document.documentElement);
        const fg = (css.getPropertyValue('--foreground') || '#111827').trim();
        const placeholder = (css.getPropertyValue('--placeholder') || css.getPropertyValue('--muted-foreground') || fg).trim();
        
        // Define styles for the iframe fields
        const styles = {
          input: {
            'font-size': '16px',
            'font-family': 'Montserrat, sans-serif',
            'color': fg,
            'font-weight': '500'
          },
          '::placeholder': {
            'color': placeholder
          },
          valid: {},
          invalid: {}
        };
        
        // Create microform instance
        const microform = flex.microform();

        // Create fields (v2 supports 'number' and 'securityCode') with styles and placeholders
        const cardNumber = microform.createField('number', { styles, placeholder: '1234 1234 1234 1234' });
        const cardCvv = microform.createField('securityCode', { styles, placeholder: 'CVV' });

        const numberEl = document.querySelector('#card-number-container') as HTMLElement;
        const cvvEl = document.querySelector('#card-cvv-container') as HTMLElement;
        try {
          cardNumber.load(numberEl);
          console.log('Card number field loaded');
        } catch (err: any) {
          console.error('Failed to load card number field:', err);
        }

        try {
          cardCvv.load(cvvEl);
          console.log('CVV field loaded');
        } catch (err: any) {
          console.error('Failed to load CVV field:', err);
        }

        // Attach error listeners for visibility
        cardNumber.on('error', (e: any) => console.error('Card number field error:', e));
        cardCvv.on('error', (e: any) => console.error('CVV field error:', e));

        // Store instances for tokenization
        (window as any).flexInstance = flex;
        (window as any).microform = microform;
        (window as any).flexFields = { cardNumber, cardCvv };
        (window as any).flexTokenCallback = onSuccess;
        (window as any).flexErrorCallback = onError;
        
    } catch (error: any) {
        console.error('Error in initializeMicroform:', error);
        onError(error);
    }
};

/**
 * Tokenize card data using Flex
 */
export const tokenizeCard = (
  cardholderName: string,
  opts: { expirationMonth: string; expirationYear: string; cardTypeOverride?: string }
): Promise<FlexToken> => {
    return new Promise((resolve, reject) => {
        const microform = (window as any).microform;
        if (!microform) {
            reject(new Error('Microform not initialized'));
            return;
        }

        const options: any = {
            expirationMonth: opts.expirationMonth,
            expirationYear: opts.expirationYear,
        };
        if (opts.cardTypeOverride) options.type = opts.cardTypeOverride;

        microform.createToken(options, (error: any, token: string) => {
            if (error) {
                console.error('Tokenization error:', error);
                reject(error);
            } else {
                const response: any = (window as any).flexLastTokenResponse || {};
                const result: FlexToken = {
                    token,
                    maskedPan: response.maskedPan || '****',
                    cardType: response.cardType || 'UNKNOWN',
                    expirationMonth: options.expirationMonth,
                    expirationYear: options.expirationYear,
                };
                resolve(result);
            }
        });
    });
};

/**
 * Process zero-amount authorization with tokenized card
 */
export const processCybersourceAuthorization = async (
    transientToken: string,
    cardholderName: string,
    bookingData: BookingData,
    cardInfo?: { lastFourDigits?: string; cardType?: string }
): Promise<AuthorizationResponse> => {
    try {
        // Send authorization request to our API with token
        const { data } = await axios.post<AuthorizationResponse>('/api/cybersource', {
            ...bookingData,
            transientToken,
            cardholderName,
            lastFourDigits: cardInfo?.lastFourDigits,
            cardType: cardInfo?.cardType
        });

        return data;
    } catch (error: any) {
        console.error('Authorization error:', error);
        
        if (error.response?.data) {
            return error.response.data;
        }
        
        return {
            success: false,
            error: error.message || 'Authorization failed'
        };
    }
};

/**
 * Complete booking process with Flex token
 */
export const completeBookingWithFlex = async (
    cardholderName: string,
    bookingData: BookingData,
    tokenOptions: { expirationMonth: string; expirationYear: string; cardTypeOverride?: string }
): Promise<AuthorizationResponse> => {
    try {
        // Show loading
        toast.loading('Verifying card details...');
        
        // Tokenize the card
        const flexToken = await tokenizeCard(cardholderName, tokenOptions);
        
        if (!flexToken.token) {
            throw new Error('Failed to tokenize card');
        }
        
        // Process authorization with token
        const response = await processCybersourceAuthorization(
            flexToken.token,
            cardholderName,
            bookingData,
            {
                lastFourDigits: flexToken.maskedPan.slice(-4),
                cardType: flexToken.cardType
            }
        );
        
        toast.dismiss(); // Clear loading toast
        
        if (response.success) {
            toast.success(response.message || 'Card verified successfully!');
        } else {
            toast.error(response.error || 'Card verification failed');
        }
        
        return response;
    } catch (error: any) {
        toast.dismiss();
        toast.error(error.message || 'Failed to process booking');
        throw error;
    }
};

/**
 * Clean up Flex Microform
 */
export const cleanupFlexMicroform = () => {
    (window as any).flexInstance = null;
    (window as any).microform = null;
    (window as any).flexTokenCallback = null;
    (window as any).flexErrorCallback = null;
    
    // Remove the script tag
    const script = document.getElementById('cybersource-flex-sdk');
    if (script) {
        script.remove();
    }
    ['#card-number-container', '#card-cvv-container'].forEach(sel => {
      const el = document.querySelector(sel);
      if (el) el.innerHTML = '';
    });
};