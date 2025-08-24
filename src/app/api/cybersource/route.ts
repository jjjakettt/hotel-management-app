import { getRoom } from "@/libs/apis";
import { authOptions } from "@/libs/auth";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { processZeroAmountAuth } from "@/libs/cybersource";

type RequestData = {
    checkinDate: string;
    checkoutDate: string;
    adults: number;
    children: number;
    numberOfDays: number;
    hotelRoomSlug: string;
    // Tokenized card data from Flex Microform
    transientToken: string;
    cardholderName: string;
    lastFourDigits?: string;
    cardType?: string;
};

export async function POST(req: Request) {
    const {
        checkinDate,
        adults,
        checkoutDate,
        children,
        hotelRoomSlug,
        numberOfDays,
        transientToken,
        cardholderName,
        lastFourDigits,
        cardType
    }: RequestData = await req.json();

    // Validate required fields
    if (
        !checkinDate || 
        !checkoutDate ||
        !adults ||
        !hotelRoomSlug || 
        !numberOfDays ||
        !transientToken ||
        !cardholderName
    ){
        return new NextResponse("Please fill in all required fields", { status: 400 });
    }

    // Get user session
    const session = await getServerSession(authOptions);
    if (!session) { 
        return new NextResponse("Authentication required", { status: 400 });
    }

    const userId = session.user.id;
    const userEmail = session.user?.email ?? null;
    if (!userEmail) {
    return NextResponse.json(
        { error: 'Email is required to authorize the card.' },
        { status: 400 }
    );
    }
    const formattedCheckoutDate = checkoutDate.split("T")[0];
    const formattedCheckinDate = checkinDate.split("T")[0];

    try {
        // Get room details
        const room = await getRoom(hotelRoomSlug);
        const discountPrice = room.price - (room.price / 100) * room.discount;
        const totalPrice = discountPrice * numberOfDays;

        // Generate a unique booking reference
        const bookingReference = `HOTEL-${userId}-${Date.now()}`;

        // Split cardholder name
        const nameParts = cardholderName.trim().split(' ');
        const firstName = nameParts[0] || '';
        const lastName = nameParts.slice(1).join(' ') || '';

        // Process zero-amount authorization
        const response = await processZeroAmountAuth(
            transientToken,
            bookingReference,
            {
                firstName,
                lastName,
                email: userEmail
            }
        );

        // Check if authorization was successful
        if (response?.status === 'AUTHORIZED' || response?.status === 'PENDING') {
            return NextResponse.json({
                success: true,
                authorizationId: response.id,
                status: response.status,
                bookingDetails: {
                    bookingReference,
                    adults,
                    checkinDate: formattedCheckinDate,
                    checkoutDate: formattedCheckoutDate,
                    children,
                    hotelRoom: room._id,
                    numberOfDays,
                    user: userId,
                    discount: room.discount,
                    totalPrice,
                    authorizationId: response.id,
                    lastFourDigits: lastFourDigits || '****',
                    cardType: cardType || response?.paymentInformation?.card?.type || 'CARD'
                },
                message: "Card verified successfully. Booking confirmed - payment will be processed at reception."
            }, {
                status: 200,
                statusText: "Authorization successful",
            });
        } else {
            // Authorization failed or declined
            const errorMessage = response?.errorInformation?.message || 
                                response?.message || 
                                "Card verification failed";
            
            return NextResponse.json({
                success: false,
                error: errorMessage,
                reason: response?.errorInformation?.reason || response?.reason || "UNKNOWN"
            }, { status: 400 });
        }

    } catch(error: any) {
        console.error("Cybersource authorization failed:", error);
        
        // Handle Cybersource API errors
        if (error.response?.data) {
            const errorData = error.response.data;
            return NextResponse.json({
                success: false,
                error: errorData.message || errorData.error || "Card verification failed",
                reason: errorData.reason || "UNKNOWN",
                details: errorData.details || []
            }, { status: 400 });
        }

        return NextResponse.json({
            success: false,
            error: "An error occurred during card verification"
        }, { status: 500 });
    }
}