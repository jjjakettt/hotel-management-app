import { defineField } from "sanity";

// Hotel Room Type Options
const roomTypes = [
    {title: 'Deluxe', value: 'deluxe'},
    {title: 'Premium', value: 'premium'},
    {title: 'Suite', value: 'suite'},
    {title: 'Presidential', value: 'presidential'},
]

const hotelRoom = {
    name: 'hotelRoom',
    title: 'Hotel Room',
    type: 'document',
    fields: [
        defineField({
            name: 'name',
            title: 'Name',
            type: 'string',
            validation: Rule => Rule.required().max(50).error("Maximum 50 Characters."),
        }),

        defineField({
            name: 'name_vi',
            title: 'Name (Vietnamese)',
            type: 'string',
            validation: Rule => Rule.max(50).error("Maximum 50 Characters."),
        }),

        defineField({
            name: 'slug',
            type: 'slug',
            options: {
                source: 'name'
            },
            validation: Rule => Rule.required(),
        }),
        defineField({
            name: 'description',
            title: 'Description',
            type: 'text',
            validation: Rule => Rule.required().min(10).error("Please Input Atleast 10 Characters."),
        }),
        defineField({
            name: 'description_vi',
            title: 'Description (Vietnamese)',
            type: 'text',
        }),
        defineField({
            name: 'price',
            title: 'Price',
            type: 'number',
            validation: Rule => Rule.required(),
        }),
        defineField({
            name: 'price_vnd',
            title: 'Price (VND)',
            type: 'number',
            description: 'Price in Vietnamese Dong',
            validation: Rule => Rule.min(0),
        }),
        defineField({
            name: 'discount',
            title: 'Discount',
            type: 'number',
            initialValue: 0,
            validation: Rule => Rule.min(0),
        }),
        defineField({
            name: 'images',
            title: 'Images',
            type: 'array',
            of: [
                {
                    type: 'object',
                    fields: [
                        { name: 'url', type: 'url', title: 'URL' },
                        { name: 'file', type: 'file', title: 'File' },
                    ]
                }
            ],
            validation: Rule => Rule.required().min(1).error('Minimum of 1 image required.'),
        }),
        defineField({
            name: 'coverImage',
            title: 'Cover Image',
            type: 'object',
            fields: [
                {name: 'url', type: 'url', title: 'URL'},
                {name: 'file', type: 'file', title: 'File'}
            ],
            validation: Rule => Rule.required().error('Cover Image is required.'),
        }),
        defineField({
            name: 'type',
            title: 'Room Type',
            type: 'string',
            options: {
                list: roomTypes,
            },
            validation: Rule => Rule.required(),
            initialValue: 'basic',
        }),

        defineField({
            name: 'specialNote',
            title: 'Special Note',
            type: 'text',
            validation: Rule => Rule.required(),
            initialValue: 'Check-time is 12:00 PM, checkout time is 11:59 AM. If you leave behind any items, please contact the receptionist.',
        }),
        defineField({
            name: 'specialNote_vi',
            title: 'Special Note (Vietnamese)',
            type: 'text',
        }),
        defineField({
            name: 'dimension',
            title: 'Dimension',
            type: 'string',
        }),
        defineField({
            name: 'numberOfBeds',
            title: 'Number of Beds',
            type: 'number',
            validation: Rule => Rule.min(1), 
            initialValue: 1,
        }),
        defineField({
            name: 'quantity',
            title: 'Quantity Available',
            type: 'number',
            validation: Rule => Rule.required().min(1),
            initialValue: 1,
            description: 'Number of rooms available of this type',
        }),
        defineField({
            name: 'offeredAmenities',
            title: 'Offered Amenities',
            type: 'array',
            of: [
                {
                type: "object",
                fields: [
                    { name: 'icon', title: 'Icon', type: 'string' },
                    { name: 'amenity', title: 'Amenity', type: 'string' },
                    { name: 'amenity_vi', title: 'Amenity (Vietnamese)', type: 'string' },
                ]
                }
            ],
        }),
        defineField({
            name: 'isBooked',
            title: 'Is Booked?',
            type: 'boolean',
            initialValue: false,
        }),
        defineField({
            name: 'isFeatured',
            title: 'Is Featured?',
            type: 'boolean',
            initialValue: false,
        }),
    ],
};

export default hotelRoom
