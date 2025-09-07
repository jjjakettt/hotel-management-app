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
            totalPrice,
            user,
        } = body;

        // Basic validation
        if (
            !adults || !checkinDate || !checkoutDate || !hotelRoom ||
            !numberOfDays || totalPrice == null || !user
        ) {
            return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
        }

        // Create booking + mark room as booked (transaction)
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
            totalPrice,
            discount,
        };

        tx.create(bookingDoc);
        tx.patch(hotelRoom, (p) => p.set({ isBooked: true }));

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