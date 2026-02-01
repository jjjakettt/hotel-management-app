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

import { getAvailability, getBookedDatesForRoom, getRoom } from "@/libs/apis";
import { createBooking } from "@/libs/apis";
import LoadingSpinner from "../../loading";
import HotelPhotoGallery from "@/components/HotelPhotoGallery/HotelPhotoGallery";
import BookRoomCta from "@/components/BookRoomCta/BookRoomCta";
import RoomReview from "@/components/RoomReview/RoomReview";
import { useTranslation } from "@/libs/translations";


const RoomDetails = (props: { params: Promise<{ slug: string }> }) => {

    const params = use(props.params);
    const slug = params.slug;

    const { data: session, status } = useSession();
    const router = useRouter();
    const { t, language } = useTranslation();

    const [ checkinDate, setCheckinDate ] = useState<Date | null>(null);
    const [ checkoutDate, setCheckoutDate ] = useState<Date | null>(null);
    const [adults, setAdults] = useState(1);
    const [noOfChildren, setNoOfChildren] = useState(0);

    const fetchRoom = async () => getRoom(slug);

    const {data: room, error, isLoading} = useSWR("/api/room", fetchRoom);
    const [selectedQuantity, setSelectedQuantity] = useState(1);

    // For booked dates
    const { data: bookedDates = [] } = useSWR(
        room?._id ? `/api/booked-dates-${room._id}` : null,
        room?._id ? () => getBookedDatesForRoom(room._id) : null
    );

    console.log('Room page bookedDates:', bookedDates);

    // For availability
    const availabilityKey = room?._id && checkinDate && checkoutDate
        ? `/api/availability-${room._id}-${checkinDate.toISOString().split('T')[0]}-${checkoutDate.toISOString().split('T')[0]}`
        : null;

    const { data: availabilityInfo } = useSWR(
        availabilityKey,
        availabilityKey && room?._id ? () => getAvailability(
            room._id,
            checkinDate!.toISOString().split('T')[0],
            checkoutDate!.toISOString().split('T')[0]
        ) : null
    );

    useEffect(() => {
        if (availabilityInfo && selectedQuantity > availabilityInfo.availableQuantity) {
            setSelectedQuantity(Math.min(1, availabilityInfo.availableQuantity));
        }
    }, [availabilityInfo, selectedQuantity]);

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
        if (status === 'loading') return;
        if (!session) {
            router.push('/auth');
            return toast.error(t("toast.loginRequired"));
        }

        if(!checkinDate || !checkoutDate)
            return toast.error(t("toast.provideDates"));

        if(checkinDate > checkoutDate)
            return toast.error(t("toast.invalidDates"));

        const numberOfDays = calcNumDays();
        const discountPrice = room.price - (room.price / 100) * room.discount;
        const totalPrice = discountPrice * numberOfDays * selectedQuantity;

        try {
            toast.loading(t("toast.creatingBooking"));

            const formattedCheckinDate = checkinDate.toISOString().split('T')[0];
            const formattedCheckoutDate = checkoutDate.toISOString().split('T')[0];

            await createBooking({
                adults,
                checkinDate: formattedCheckinDate,
                checkoutDate: formattedCheckoutDate,
                children: noOfChildren,
                hotelRoom: room._id,
                numberOfDays,
                discount: room.discount,
                quantity: selectedQuantity,
                totalPrice,
                user: session.user.id
            });

            toast.dismiss();
            toast.success(t("toast.bookingConfirmed"));

            router.push(`/users/${session.user.id}`);
        } catch (error) {
            toast.dismiss();
            console.error('Failed to create booking:', error);
            toast.error(t("toast.bookingFailed"));
        }
    };

    const displayName = (language === "vi" && room.name_vi) ? room.name_vi : room.name;
    const displayDesc = (language === "vi" && room.description_vi) ? room.description_vi : room.description;
    const displaySpecialNote = (language === "vi" && room.specialNote_vi) ? room.specialNote_vi : room.specialNote;

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
                                {displayName} ({room.dimension})
                            </h2>
                            <div className="flex my-11">
                                {(room.offeredAmenities ?? []).map(ammenity => (
                                    <div
                                        key={ammenity._key}
                                        className="md:w-44 w-fit text-center px-2 md:px-0 h-20 md:h-40 mr-3 bg-[var(--background-secondary)] rounded-lg grid place-content-center"
                                    >
                                        <i className={`fa-solid ${ammenity.icon} md:text-2xl`}></i>
                                        <p className="text-xs md:text-base pt-3">
                                            {(language === "vi" && ammenity.amenity_vi) ? ammenity.amenity_vi : ammenity.amenity}
                                        </p>
                                    </div>
                                ))}
                            </div>
                            {/* Room Description Section */}
                            <div className='mb-11'>
                                <h2 className='font-bold text-3xl mb-2'>{t("room.description")}</h2>
                                <p>{displayDesc}</p>
                            </div>
                            {/* Offered Amenities Section */}
                            <div className='mb-11'>
                                <h2 className='font-bold text-3xl mb-2'>{t("room.offeredAmenities")}</h2>
                                <div className='grid grid-cols-2'>
                                {(room.offeredAmenities ?? []).map(amenity => (
                                    <div
                                    key={amenity._key}
                                    className='flex items-center md:my-0 my-1'
                                    >
                                    <i className={`fa-solid ${amenity.icon}`}></i>
                                    <p className='text-xs md:text-base ml-2'>
                                        {(language === "vi" && amenity.amenity_vi) ? amenity.amenity_vi : amenity.amenity}
                                    </p>
                                    </div>
                                ))}
                                </div>
                            </div>
                            {/* Safety and Hygiene Section */}
                            <div className='mb-11'>
                                <h2 className='font-bold text-3xl mb-2'>{t("room.safetyHygiene")}</h2>
                                <div className='grid grid-cols-2'>
                                <div className='flex items-center my-1 md:my-0'>
                                    <MdOutlineCleaningServices />
                                    <p className='ml-2 md:text-base text-xs'>{t("room.dailyCleaning")}</p>
                                </div>
                                <div className='flex items-center my-1 md:my-0'>
                                    <LiaFireExtinguisherSolid />
                                    <p className='ml-2 md:text-base text-xs'>{t("room.fireExtinguishers")}</p>
                                </div>
                                <div className='flex items-center my-1 md:my-0'>
                                    <AiOutlineMedicineBox />
                                    <p className='ml-2 md:text-base text-xs'>{t("room.disinfections")}</p>
                                </div>
                                <div className='flex items-center my-1 md:my-0'>
                                    <GiSmokeBomb />
                                    <p className='ml-2 md:text-base text-xs'>{t("room.smokeDetectors")}</p>
                                </div>
                                </div>
                            </div>
                            {/* Reviews */}
                            <div className='shadow-[0_4px_6px_var(--shadow-color)] rounded-lg p-6'>
                                <div className='items-center mb-4'>
                                <p className='md:text-lg font-semibold'>{t("room.customerReviews")}</p>
                                </div>
                                <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                                    <RoomReview roomId={room._id} />
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="md:col-span-4 rounded-xl shadow-[0_4px_6px_var(--shadow-color)] sticky top-10 h-fit overflow-auto">
                        <BookRoomCta
                            discount={room.discount}
                            price={room.price}
                            price_vnd={room.price_vnd}
                            specialNote={displaySpecialNote}
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
                            selectedQuantity={selectedQuantity}
                            setSelectedQuantity={setSelectedQuantity}
                            availabilityInfo={availabilityInfo}
                        />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default RoomDetails
