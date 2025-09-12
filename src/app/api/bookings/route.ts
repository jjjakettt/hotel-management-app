import { NextResponse } from 'next/server';
import { createClient } from '@sanity/client';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/libs/auth';

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET!;
const token = process.env.SANITY_STUDIO_TOKEN!; 

const writeClient = createClient({
  projectId,
  dataset,
  token,
  apiVersion: '2022-03-07',
  useCdn: false,
});

export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await req.json();
        const {
            adults,
            checkinDate,
            checkoutDate,
            children,
            discount,
            hotelRoom,
            numberOfDays,
            quantity,
            totalPrice,
            user,
        } = body;


        console.log('Individual field check:', {
            adults: !!adults,
            checkinDate: !!checkinDate,
            checkoutDate: !!checkoutDate,
            children: children != null,
            discount: discount != null,
            hotelRoom: !!hotelRoom,
            numberOfDays: !!numberOfDays,
            quantity: !!quantity,
            totalPrice: totalPrice != null,
            user: !!user,
        });

        console.log('Actual values:', {
            adults, checkinDate, checkoutDate, children,
            discount, hotelRoom, numberOfDays, quantity, totalPrice, user
        });
        // Basic validation
        if (
            !adults || !checkinDate || !checkoutDate || !hotelRoom ||
            !numberOfDays || totalPrice == null || !user || !quantity ||
            children == null || discount == null
        ) {
            console.log('Validation failed - missing fields');
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        // Validate dates
        const checkin = new Date(checkinDate);
        const checkout = new Date(checkoutDate);
        if (checkin >= checkout) {
            return NextResponse.json({ error: 'Invalid date range' }, { status: 400 });
        }

        // Overlapping Bookings Check
        const [room, existingBookings] = await Promise.all([
            writeClient.fetch(
                `*[_type == "hotelRoom" && _id == $roomId][0]{ quantity }`,
                { roomId: hotelRoom }
            ),
            writeClient.fetch(
                `*[_type == "booking" && hotelRoom._ref == $roomId && (
                    (checkinDate <= $checkin && checkoutDate > $checkin) ||
                    (checkinDate < $checkout && checkoutDate >= $checkout) ||
                    (checkinDate >= $checkin && checkoutDate <= $checkout)
                )]{ quantity }`,
                { roomId: hotelRoom, checkin: checkinDate, checkout: checkoutDate }
            )
        ]);

        const totalBookedQuantity = existingBookings.reduce((sum: number, booking: any) => sum + (booking.quantity || 0), 0);

        if (totalBookedQuantity + quantity > room.quantity) {
            return NextResponse.json({ error: 'Not enough rooms available for selected dates' }, { status: 409 });
        }

        const tx = writeClient.transaction();

        const bookingDoc = {
            _type: 'booking',
            user: { _type: 'reference', _ref: user },
            hotelRoom: { _type: 'reference', _ref: hotelRoom },
            checkinDate,
            checkoutDate,
            numberOfDays,
            adults,
            children,
            quantity,
            totalPrice,
            discount,
        };
        console.log('Received booking data:', {
            adults, checkinDate, checkoutDate, children, 
            discount, hotelRoom, numberOfDays, quantity, totalPrice, user
        }); 
        tx.create(bookingDoc);

        const result = await tx.commit();

        return NextResponse.json({ success: true, result }, { status: 200 });
    } catch (err: any) {
            console.error('Create booking failed:', err?.response?.body || err);
        return NextResponse.json(
            { success: false, error: err?.message || 'Failed to create booking' },
            { status: 500 }
        );
    }
}