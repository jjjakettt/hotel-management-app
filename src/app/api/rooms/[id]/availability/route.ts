import { NextResponse } from 'next/server';
import sanityClient from '@/libs/sanity';

export async function GET(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id: roomId } = await params;
    const { searchParams } = new URL(req.url);
    const checkinDate = searchParams.get('checkinDate');
    const checkoutDate = searchParams.get('checkoutDate');

    if (!checkinDate || !checkoutDate) {
        return NextResponse.json({ error: 'Dates required' }, { status: 400 });
    }

    try {
        // Get room quantity
        const room = await sanityClient.fetch(
            `*[_type == "hotelRoom" && _id == $roomId][0]{ quantity }`,
            { roomId }
        );

        // Count overlapping bookings
        const overlappingBookings = await sanityClient.fetch(
            `count(*[_type == "booking" && hotelRoom._ref == $roomId && (
                (checkinDate <= $checkin && checkoutDate > $checkin) ||
                (checkinDate < $checkout && checkoutDate >= $checkout) ||
                (checkinDate >= $checkin && checkoutDate <= $checkout)
            )])`,
            { roomId, checkin: checkinDate, checkout: checkoutDate }
        );

        const availableQuantity = room.quantity - overlappingBookings;

        return NextResponse.json({ 
            availableQuantity: Math.max(0, availableQuantity),
            totalQuantity: room.quantity 
        });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to check availability' }, { status: 500 });
    }
}