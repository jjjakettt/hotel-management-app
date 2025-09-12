import { NextResponse } from 'next/server';
import sanityClient from '@/libs/sanity';

export async function GET(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id: roomId } = await params;

    try {
        const bookedDates = await sanityClient.fetch(
            `*[_type == "booking" && hotelRoom._ref == $roomId && checkoutDate >= now()] {
                checkinDate,
                checkoutDate
            }`,
            { roomId }
        );

        return NextResponse.json(bookedDates, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch booked dates' }, { status: 500 });
    }
}