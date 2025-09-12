'use client';

import { useState, use, useEffect } from "react";
import { MdOutlineCleaningServices } from "react-icons/md";
import { LiaFireExtinguisherSolid } from "react-icons/lia";
import { AiOutlineMedicineBox } from "react-icons/ai";
import { GiSmokeBomb } from "react-icons/gi";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import useSWR from "swr";

import { getBookedDates, getRoom } from "@/libs/apis";
import { createBooking } from "@/libs/apis";
import LoadingSpinner from "../../loading";
import HotelPhotoGallery from "@/components/HotelPhotoGallery/HotelPhotoGallery";
import BookRoomCta from "@/components/BookRoomCta/BookRoomCta";
import RoomReview from "@/components/RoomReview/RoomReview";

const RoomDetails = (props: { params: Promise<{ slug: string }> }) => {

    const params = use(props.params);
    const slug = params.slug;

    const { data: session, status } = useSession();
    const router = useRouter();

    const [ checkinDate, setCheckinDate ] = useState<Date | null>(null);
    const [ checkoutDate, setCheckoutDate ] = useState<Date | null>(null);
    const [adults, setAdults] = useState(1);
    const [noOfChildren, setNoOfChildren] = useState(0);
    const [bookedDates, setBookedDates] = useState<string[]>([]);

    const fetchRoom = async () => getRoom(slug);

    const {data: room, error, isLoading} = useSWR("/api/room", fetchRoom);

    useEffect(() => {
        if (room?._id) {
            const fetchBookedDates = async () => {
                try {
                    const dates = await getBookedDates(room._id);
                    const disabledDates: string[] = [];
                    const today = new Date();
                    today.setHours(0, 0, 0, 0); // Start of today
                    
                    dates.forEach((booking: any) => {
                        const start = new Date(booking.checkinDate);
                        const end = new Date(booking.checkoutDate);
                        for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
                            if (d >= today) {
                                disabledDates.push(d.toISOString().split('T')[0]);
                            }
                        }
                    });
                    setBookedDates(disabledDates);
                } catch (error) {
                    console.error('Failed to fetch booked dates:', error);
                }
            };
            fetchBookedDates();
        }
    }, [room?._id]);

    if (error) throw new Error('Cannot fetch data');
    if (typeof room === 'undefined' && !isLoading)
        throw new Error('Cannot fetch data');

    if (!room) return <LoadingSpinner />;

    const calcMinCheckoutDate = () => {
        if (checkinDate) { 
            const nextDay = new Date(checkinDate);
            nextDay.setDate(nextDay.getDate() + 1);
            return nextDay;
        }
        return null;
    };

    const calcNumDays = () => {
        if(!checkinDate || !checkoutDate) return 0;
        const timeDiff = checkoutDate.getTime() - checkinDate.getTime();
        const noOfDays = Math.ceil(timeDiff / (24 * 60 * 60 * 1000));
        return noOfDays;
    }

    const handleBookNowClick = async () => {
        // Check if user is logged in
        if (status === 'loading') return; 
        if (!session) {
            router.push('/auth');
            return toast.error("Please login before booking a room.");
        }

        if(!checkinDate || !checkoutDate) 
            return toast.error("Please provide checkin / checkout dates.");

        if(checkinDate > checkoutDate)
            return toast.error("Please choose a valid checkin period.");

        const numberOfDays = calcNumDays();
        const discountPrice = room.price - (room.price / 100) * room.discount;
        const totalPrice = discountPrice * numberOfDays;

        try {
            toast.loading('Creating your booking...');
            
            // Format dates for Sanity
            const formattedCheckinDate = checkinDate.toISOString().split('T')[0];
            const formattedCheckoutDate = checkoutDate.toISOString().split('T')[0];
            
            // Create booking directly in Sanity
            await createBooking({
                adults,
                checkinDate: formattedCheckinDate,
                checkoutDate: formattedCheckoutDate,
                children: noOfChildren,
                hotelRoom: room._id,
                numberOfDays,
                discount: room.discount,
                totalPrice,
                user: session.user.id
            });

            toast.dismiss();
            toast.success('Booking confirmed! Payment will be collected at reception.');
            
            // Redirect to user bookings page
            router.push(`/users/${session.user.id}`);
        } catch (error) {
            toast.dismiss();
            console.error('Failed to create booking:', error);
            toast.error('Failed to create booking. Please try again.');
        }
    };



    if (error) 
        throw new Error("Cannot fetch data");
    if (typeof room === "undefined" && !isLoading) 
        throw new Error("Cannot fetch data");

    if (!room) return <LoadingSpinner/>;

    return (
        <div>
            <HotelPhotoGallery
                photos = {room.images}
            />
            <div className="container mx-auto mt-20">
                <div className="md:grid md:grid-cols-12 gap-10 px-3">
                    <div className="md:col-span-8 md:w-full">
                        {/* Room Information */}
                        <div>
                            <h2 className="font-bold text-left text-lg md:text-2xl">
                                {room.name} ({room.dimension})
                            </h2>
                            <div className="flex my-11">
                                {room.offeredAmenities.map(ammenity => (
                                    <div 
                                        key={ammenity._key} 
                                        className="md:w-44 w-fit text-center px-2 md:px-0 h-20 md:h-40 mr-3 bg-[var(--background-secondary)] rounded-lg grid place-content-center"
                                    >
                                        <i className={`fa-solid ${ammenity.icon} md:text-2xl`}></i>
                                        <p className="text-xs md:text-base pt-3">{ammenity.amenity}</p>
                                    </div>
                                ))}
                            </div>
                            {/* Room Description Section */}
                            <div className='mb-11'>
                                <h2 className='font-bold text-3xl mb-2'>Description</h2>
                                <p>{room.description}</p>
                            </div>
                            {/* Offered Amenities Section */}
                            <div className='mb-11'>
                                <h2 className='font-bold text-3xl mb-2'>Offered Amenities</h2>
                                <div className='grid grid-cols-2'>
                                {room.offeredAmenities.map(amenity => (
                                    <div
                                    key={amenity._key}
                                    className='flex items-center md:my-0 my-1'
                                    >
                                    <i className={`fa-solid ${amenity.icon}`}></i>
                                    <p className='text-xs md:text-base ml-2'>
                                        {amenity.amenity}
                                    </p>
                                    </div>
                                ))}
                                </div>
                            </div>
                            {/* Safety and Hygiene Section */}
                            <div className='mb-11'>
                                <h2 className='font-bold text-3xl mb-2'>Safety And Hygiene</h2>
                                <div className='grid grid-cols-2'>
                                <div className='flex items-center my-1 md:my-0'>
                                    <MdOutlineCleaningServices />
                                    <p className='ml-2 md:text-base text-xs'>Daily Cleaning</p>
                                </div>
                                <div className='flex items-center my-1 md:my-0'>
                                    <LiaFireExtinguisherSolid />
                                    <p className='ml-2 md:text-base text-xs'>Fire Extinguishers</p>
                                </div>
                                <div className='flex items-center my-1 md:my-0'>
                                    <AiOutlineMedicineBox />
                                    <p className='ml-2 md:text-base text-xs'>Disinfections and Sterilizations</p>
                                </div>
                                <div className='flex items-center my-1 md:my-0'>
                                    <GiSmokeBomb />
                                    <p className='ml-2 md:text-base text-xs'>Smoke Detectors</p>
                                </div>
                                </div>
                            </div>
                            {/* Reviews */}
                            <div className='shadow-[0_4px_6px_var(--shadow-color)] rounded-lg p-6'>
                                <div className='items-center mb-4'>
                                <p className='md:text-lg font-semibold'>Customer Reviews</p>
                                </div>
                                <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                                    {/* Reviews */}
                                    <RoomReview roomId={room._id} />
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="md:col-span-4 rounded-xl shadow-[0_4px_6px_var(--shadow-color)] sticky top-10 h-fit overflow-auto">
                        {/* Book Room Call-to-action */}
                        <BookRoomCta 
                            discount={room.discount} 
                            price={room.price} 
                            specialNote={room.specialNote}
                            checkinDate={checkinDate}
                            setCheckinDate={setCheckinDate}
                            checkoutDate={checkoutDate}
                            setCheckoutDate={setCheckoutDate}
                            calcMinCheckoutDate={calcMinCheckoutDate}
                            adults={adults}
                            noOfChildren={noOfChildren}
                            setAdults={setAdults}
                            setNoOfChildren={setNoOfChildren}
                            isBooked={room.isBooked}
                            handleBookNowClick={handleBookNowClick}
                            bookedDates={bookedDates}
                        />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default RoomDetails
