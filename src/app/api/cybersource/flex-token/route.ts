import { NextResponse } from "next/server";
import { generateCaptureContext } from "@/libs/cybersource";

/**
 * Generate Flex Microform token for secure card capture
 */
export async function POST(req: Request) {
    try {
        const targetOrigin = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
        
        console.log("Attempting to generate capture context for origin:", targetOrigin);
        console.log("Using merchant ID:", process.env.CYBERSOURCE_MERCHANT_ID);
        
        // Generate capture context using our helper function
        const captureContext = await generateCaptureContext(targetOrigin);
        
        if (!captureContext) {
            throw new Error("No capture context returned from Cybersource");
        }
        
        console.log("Successfully generated capture context");
        
        return NextResponse.json({
            success: true,
            captureContext: captureContext
        }, { status: 200 });
        
    } catch (error: any) {
        console.error("Flex token generation error:", error);
        console.error("Error details:", error.response?.data || error.message);
        
        return NextResponse.json({
            success: false,
            error: error.message || "Failed to generate Flex token",
            details: error.response?.data || null
        }, { status: 500 });
    }
}