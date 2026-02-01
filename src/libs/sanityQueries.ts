import { groq } from "next-sanity";

const imageProjection = `{
    _key,
    "url": coalesce(url, file.asset->url)
}`;

const coverImageProjection = `{
    "url": coalesce(url, file.asset->url)
}`;

export const getFeaturedRoomQuery = groq`*[_type == "hotelRoom" && isFeatured == true][0] {
    _id,
    description,
    description_vi,
    discount,
    "images": images[] ${imageProjection},
    isFeatured,
    name,
    name_vi,
    price,
    price_vnd,
    quantity,
    slug,
    "coverImage": coverImage ${coverImageProjection}
}`;

export const getRoomsQuery = groq`*[_type == "hotelRoom"] {
    _id,
    "coverImage": coverImage ${coverImageProjection},
    description,
    description_vi,
    dimension,
    isBooked,
    isFeatured,
    name,
    name_vi,
    price,
    price_vnd,
    quantity,
    slug,
    type
}`;

export const getRoom = groq`*[_type == "hotelRoom" && slug.current == $slug][0] {
    _id,
    "coverImage": coverImage ${coverImageProjection},
    description,
    description_vi,
    dimension,
    "images": images[] ${imageProjection},
    isBooked,
    isFeatured,
    name,
    name_vi,
    numberOfBeds,
    offeredAmenities,
    price,
    price_vnd,
    discount,
    quantity,
    slug,
    specialNote,
    specialNote_vi,
    type
}`;

export const getUserBookingsQuery = groq`*[_type == 'booking' && user._ref == $userId] {
    _id,
    hotelRoom -> {
        _id,
        name,
        name_vi,
        slug,
        price
    },
    checkinDate,
    checkoutDate,
    numberOfDays,
    adults,
    children,
    quantity,
    totalPrice,
    discount
}`;

export const getUserDataQuery = groq`*[_type == 'user' && _id == $userId][0] {
    _id,
    name,
    email,
    isAdmin,
    about,
    _createdAt,
    image,
}`;

export const getRoomReviewsQuery = groq`*[_type == 'review' && hotelRoom._ref == $roomId] {
    _createdAt,
    _id,
    text,
    user -> {
        name
    },
    userRating
}`;

export const getAvailableRoomsQuery = groq`*[_type == "hotelRoom" && !(_id in *[_type == "booking" && checkinDate <= $checkinDate && checkoutDate > $checkinDate].hotelRoom._ref)] {
    _id,
    "coverImage": coverImage ${coverImageProjection},
    description,
    description_vi,
    dimension,
    isBooked,
    isFeatured,
    name,
    name_vi,
    price,
    price_vnd,
    slug,
    type
}`;
