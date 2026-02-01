import { defineField } from 'sanity';

const review = {
    name: 'review',
    title: 'Review',
    type: 'document',
    preview: {
        select: {
            userName: 'user.name',
            roomName: 'hotelRoom.name',
            rating: 'userRating',
        },
        prepare({ userName, roomName, rating }: {
            userName?: string;
            roomName?: string;
            rating?: number;
        }) {
            const stars = rating ? '★'.repeat(rating) + '☆'.repeat(5 - rating) : '';
            return {
                title: `${stars} ${userName || 'Unknown'} - ${roomName || 'Unknown'}`,
            };
        },
    },
    fields: [
        defineField({
        name: 'user',
        title: 'User',
        type: 'reference',
        to: [{ type: 'user' }],
        validation: Rule => Rule.required(),
        }),
        defineField({
        name: 'hotelRoom',
        title: 'Hotel Room',
        type: 'reference',
        to: [{ type: 'hotelRoom' }],
        validation: Rule => Rule.required(),
        }),
        defineField({
        name: 'text',
        title: 'Review Text',
        type: 'text',
        validation: Rule => Rule.required(),
        }),
        defineField({
        name: 'userRating',
        title: 'User Rating',
        type: 'number',
        validation: Rule =>
            Rule.required().min(1).max(5).error('Rating must be between 1 and 5'),
        }),
    ],
};

export default review;