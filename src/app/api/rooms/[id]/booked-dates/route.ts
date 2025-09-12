// import { NextResponse } from 'next/server';
// import sanityClient from '@/libs/sanity';

// export async function GET(
//     req: Request,
//     { params }: { params: Promise<{ id: string }> }
// ) {
//     const { id: roomId } = await params;

//     try {
//         const bookedDates = await sanityClient.fetch(
//             `*[_type == "booking" && hotelRoom._ref == $roomId && checkoutDate >= now()] {
//                 checkinDate,
//                 checkoutDate
//             }`,
//             { roomId }
//         );

//         return NextResponse.json(bookedDates, { status: 200 });
//     } catch (error) {
//         return NextResponse.json({ error: 'Failed to fetch booked dates' }, { status: 500 });
//     }
// }

import { NextResponse } from 'next/server';
import sanityClient from '@/libs/sanity';

export async function GET(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id: roomId } = await params;

    try {
        // Get room quantity
        const room = await sanityClient.fetch(
            `*[_type == "hotelRoom" && _id == $roomId][0]{ quantity }`,
            { roomId }
        );

        // Get all bookings for this room
        const bookings = await sanityClient.fetch(
            `*[_type == "booking" && hotelRoom._ref == $roomId && checkoutDate >= now()] {
                checkinDate,
                checkoutDate
            }`,
            { roomId }
        );

        // Count bookings per date
        const dateBookingCount: { [key: string]: number } = {};
        
        bookings.forEach((booking: any) => {
            const start = new Date(booking.checkinDate);
            const end = new Date(booking.checkoutDate);
            
            for (let d = new Date(start); d < end; d.setDate(d.getDate() + 1)) {
                const dateStr = d.toISOString().split('T')[0];
                dateBookingCount[dateStr] = (dateBookingCount[dateStr] || 0) + 1;
            }
        });

        // Only return dates that are fully booked
        const fullyBookedDates = Object.entries(dateBookingCount)
            .filter(([_, count]) => count >= room.quantity)
            .map(([date, _]) => date);

        return NextResponse.json(fullyBookedDates, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch booked dates' }, { status: 500 });
    }
}