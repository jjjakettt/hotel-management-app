
type CoverImage = {
    url: string; 

};

export type Image = {
    _key: string;
    url: string;
};

type Amenity = {
    _key: string;
    amenity: string;
    amenity_vi?: string;
    icon: string;
};

type Slug = {
    _type: string;
    current: string;
};

export type Room = {
    _id: string;
    coverImage: CoverImage;
    description: string;
    description_vi?: string;
    dimension: string;
    discount: number;
    images: Image[];
    isBooked: boolean;
    isFeatured: boolean;
    name: string;
    name_vi?: string;
    numberOfBeds: number;
    quantity: number;
    offeredAmenities: Amenity[];
    price: number;
    slug: Slug;
    specialNote: string;
    specialNote_vi?: string;
    type: string;
};

export type CreateBookingDto = {
    user: string;
    hotelRoom: string;
    checkinDate: string;
    checkoutDate: string;
    numberOfDays: number;
    adults: number;
    children: number;
    quantity: number;
    totalPrice: number;
    discount: number;
}