export type Booking = {
    _id: string;
    hotelRoom: {
        _id: string;
        name: string;
        name_vi?: string;
        slug: { current: string };
        price_usd: number;
        price_vnd?: number;
    };
    checkinDate: string;
    checkoutDate: string;
    numberOfDays: number;
    adults: number;
    children: number;
    quantity: number; 
    totalPrice: number;
    discount: number;
};