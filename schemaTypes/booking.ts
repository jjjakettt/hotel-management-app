import { defineField } from "sanity";

const booking = {
    name: 'booking',
    title: 'Booking',
    type: 'document',
    preview: {
        select: {
            userName: 'user.name',
            roomName: 'hotelRoom.name',
            checkinDate: 'checkinDate',
            checkoutDate: 'checkoutDate',
        },
        prepare({ userName, roomName, checkinDate, checkoutDate }: {
            userName?: string;
            roomName?: string;
            checkinDate?: string;
            checkoutDate?: string;
        }) {
            const checkin = checkinDate ? new Date(checkinDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : '';
            const checkout = checkoutDate ? new Date(checkoutDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : '';
            const dateRange = checkin && checkout ? ` (${checkin} - ${checkout})` : '';
            return {
                title: `${userName || 'Unknown'} - ${roomName || 'Unknown'}${dateRange}`,
            };
        },
    },
    fields: [
        defineField({
            name: 'user',
            title: 'User',
            type: 'reference',
            to: [{type: 'user' }],
            validation: Rule => Rule.required(),
        }), 
        defineField({
            name: 'hotelRoom',
            title: 'Hotel Room',
            type: 'reference',
            to: [{type: 'hotelRoom'}],
            validation: Rule => Rule.required(),
        }), 
        defineField({
            name: 'checkinDate',
            title: 'Check-in Date',
            type: 'date',
            validation: Rule => Rule.required(),
        }), 
        defineField({
            name: 'checkoutDate',
            title: 'Check-out Date',
            type: 'date',
            validation: Rule => Rule.required(),
        }), 
        defineField({
            name: 'numberOfDays',
            title: 'Number of Days',
            type: 'number',
            initialValue: 1,
            validation: Rule => Rule.required().min(1),
        }), 
        defineField({
            name: 'discount',
            title: 'Discount',
            type: 'number',
            initialValue: 0,
            validation: Rule => Rule.required().min(0),
        }), 
        defineField({
            name: 'adults',
            title: 'Adults',
            type: 'number',
            initialValue: 1,
            validation: Rule => Rule.required().min(1),
        }), 
        defineField({
            name: 'children',
            title: 'Children',
            type: 'number',
            initialValue: 0,
            validation: Rule => Rule.required().min(0),
        }), 
        defineField({
            name: 'quantity',
            title: 'Quantity',
            type: 'number',
            initialValue: 1,
            validation: Rule => Rule.required().min(1),
        }),
        defineField({
            name: 'totalPrice',
            title: 'Total Price',
            type: 'number',
            validation: Rule => Rule.required().min(0),
        }),
        defineField({
            name: 'checkedIn',
            title: 'Checked In',
            type: 'boolean',
            initialValue: false,
        }),
        defineField({
            name: 'checkedOut',
            title: 'Checked Out',
            type: 'boolean',
            initialValue: false,
        }),
    ],
};

export default booking