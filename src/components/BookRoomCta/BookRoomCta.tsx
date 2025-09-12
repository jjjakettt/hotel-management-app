'use client';

import { Dispatch, FC, SetStateAction } from "react";
import DatePicker from "react-datepicker";

import 'react-datepicker/dist/react-datepicker.css';

type Props = {
    setCheckinDate: Dispatch<SetStateAction<Date | null>>;
    setCheckoutDate: Dispatch<SetStateAction<Date | null>>;
    calcMinCheckoutDate: () => Date | null;
    setAdults: Dispatch<SetStateAction<number>>;
    setNoOfChildren: Dispatch<SetStateAction<number>>;
    handleBookNowClick: () => void;
    setSelectedQuantity: Dispatch<SetStateAction<number>>;
    price: number;
    discount: number;
    isBooked: boolean;
    specialNote: string;
    checkinDate: Date | null;
    checkoutDate: Date | null;
    adults: number;
    noOfChildren: number;
    bookedDates?: string[];
    availabilityInfo?: {
        availableQuantity: number;
        totalQuantity: number;
    } | null;
    selectedQuantity: number;
}
const BookRoomCta: FC<Props> = props => {

    const { 
        setCheckinDate,
        setCheckoutDate,
        calcMinCheckoutDate,
        setAdults,
        setNoOfChildren,
        handleBookNowClick,
        setSelectedQuantity,
        price, 
        discount, 
        specialNote,
        checkinDate,
        checkoutDate,
        adults,
        noOfChildren,
        bookedDates,
        availabilityInfo,
        selectedQuantity,
    
    } = props;

    const discountPrice = price - (price / 100) * discount;

    const calcNoOfDays = () => {
        if(!checkinDate || !checkoutDate) return 0;
        const timeDiff = checkoutDate.getTime() - checkinDate.getTime();
        const noOfDays = Math.ceil(timeDiff / (24 * 60 * 60 * 1000));
        return noOfDays;
    }
    const calcTotalPrice = () => {
        if (!checkinDate || !checkoutDate) return 0;
        const days = calcNoOfDays();
        return days * discountPrice * selectedQuantity;
    };  



    
    return (
        <div className="px-7 py-6"> 
            <h3>
                <span
                className={`${discount ? 'text-gray-400' : ''} font-bold text-xl`}
                >
                $ {price}
                </span>
                {discount ? (
                <span className='font-bold text-xl'>
                    {' '}
                    | discount {discount}%. Now{' '}
                    <span className='text-tertiary-dark'>${discountPrice}</span>
                </span>
                ) : (
                ''
                )}
            </h3>

            <div className='w-full border-b-2 border-b-secondary my-2' />

            <h4 className='my-8'>{specialNote}</h4>

            {/* Availability */}
            {/* {availabilityInfo && checkinDate && checkoutDate && (
                <div className='mb-4 p-3 bg-[var(--background-secondary)] rounded-lg'>
                    <p className='text-sm font-medium'>
                        {availabilityInfo.availableQuantity > 0 
                            ? `${availabilityInfo.availableQuantity} of ${availabilityInfo.totalQuantity} rooms available`
                            : 'No rooms available for selected dates'
                        }
                    </p>
                </div>
            )} */}

            <div className='flex'>
                {/* Checkin Date */}
                <div className='w-1/2 pr-2'>
                    <label
                        htmlFor='check-in-date'
                        className='block text-sm font-medium text-[var(--foreground-secondary)]'
                    >
                        Check In date
                    </label>
                    <DatePicker
                        selected={checkinDate}
                        onChange={date => setCheckinDate(date)}
                        dateFormat='dd/MM/yyyy'
                        minDate={new Date()}
                        excludeDates={bookedDates?.map(d => new Date(d)) || []}
                        id='check-in-date'
                        className='w-full border text-[var(--foreground-secondary)] border-gray-300 rounded-lg p-2.5 focus:ring-primary focus:border-primary react-datepicker-exclude-booked'
                    />
                </div>
                {/* Checkout Date */}
                <div className='w-1/2 pl-2'>
                    <label
                        htmlFor='check-out-date'
                        className='block text-sm font-medium text-[var(--foreground-secondary)]'
                    >
                        Check Out date
                    </label>
                    <DatePicker
                        selected={checkoutDate}
                        onChange={date => setCheckoutDate(date)}
                        dateFormat='dd/MM/yyyy'
                        disabled={!checkinDate}
                        minDate={calcMinCheckoutDate() ?? undefined}
                        excludeDates={bookedDates?.map(d => new Date(d)) || []}
                        id='check-out-date'
                        className='w-full border text-[var(--foreground-secondary)] border-gray-300 rounded-lg p-2.5 focus:ring-primary focus:border-primary react-datepicker-exclude-booked'
                    />
                </div>
            </div>
                <div className='flex mt-4'>
                    <div className='w-1/2 pr-2'>
                        <label
                            htmlFor='adults'
                            className='block text-sm font-medium text-[var(--foreground-secondary)]'
                        >
                            Adults
                        </label>
                        <input
                            type='number'
                            id='adults'
                            value={adults}
                            onChange={e => setAdults(+e.target.value)}
                            min={1}
                            max={5}
                            className='w-full border border-gray-300 rounded-lg p-2.5'
                        />
                        </div>
                        <div className='w-1/2 pl-2'>
                        <label
                            htmlFor='children'
                            className='block text-sm font-medium text-[var(--foreground-secondary)]'
                        >
                            Children
                        </label>
                        <input
                            type='number'
                            id='children'
                            value={noOfChildren}
                            onChange={e => setNoOfChildren(+e.target.value)}
                            min={0}
                            max={3}
                            className='w-full border border-gray-300 rounded-lg p-2.5'
                        />
                        {/* <div className='w-1/2 pl-2'>
                            <label
                                htmlFor='quantity'
                                className='block text-sm font-medium text-[var(--foreground-secondary)]'
                            >
                                Rooms
                            </label>
                            <input
                                type='number'
                                id='quantity'
                                value={selectedQuantity}
                                onChange={e => setSelectedQuantity(+e.target.value)}
                                min={1}
                                max={availabilityInfo?.availableQuantity || 1}
                                className='w-full border border-gray-300 rounded-lg p-2.5'
                            />
                        </div> */}
                    </div>
                </div>
                {availabilityInfo && checkinDate && checkoutDate && availabilityInfo.availableQuantity > 0 && (
                    <div className='flex mt-4'>
                        <div className='w-1/2 pr-2'>
                            <label
                                htmlFor='quantity'
                                className='block text-sm font-medium text-[var(--foreground-secondary)] mb-2'
                            >
                                Rooms
                            </label>
                            <input
                                type='number'
                                id='quantity'
                                value={selectedQuantity}
                                onChange={e => setSelectedQuantity(+e.target.value)}
                                min={1}
                                max={availabilityInfo.availableQuantity}
                                className='w-full border border-gray-300 rounded-lg p-2.5'
                            />
                        </div>
                        <div className='w-1/2 pl-2'>
                            <label className='block text-sm font-medium text-[var(--foreground-secondary)] mb-2'>
                                Availability
                            </label>
                            <div className='w-full h-[42px] flex items-center justify-center p-2.5 bg-[var(--background-secondary)] rounded-lg border border-gray-300'>
                                <p className='text-sm font-medium'>
                                    {availabilityInfo.availableQuantity} of {availabilityInfo.totalQuantity} available
                                </p>
                            </div>
                        </div>
                    </div>
                )}

                {/* Show unavailable message when no rooms left */}
                {availabilityInfo && checkinDate && checkoutDate && availabilityInfo.availableQuantity === 0 && (
                    <div className='mt-4 p-3 bg-red-100 rounded-lg'>
                        <p className='text-sm font-medium text-red-700'>
                            No rooms available for selected dates
                        </p>
                    </div>
                )}
                {calcNoOfDays() > 0 ? (
                    <div>
                        <p className="mt-3">
                            Total Price: ${calcTotalPrice()}
                        </p>
                        <p className="text-xs text-gray-600">
                            {selectedQuantity} room{selectedQuantity > 1 ? 's' : ''} × {calcNoOfDays()} day{calcNoOfDays() > 1 ? 's' : ''} × ${discountPrice}
                        </p>
                    </div>
                ) : (
                    <></>
                )}
                
                <button
                    disabled={availabilityInfo?.availableQuantity === 0}
                    onClick={handleBookNowClick}
                    className={`w-full mt-6 px-6 md:px-[50px] lg:px-[72px] py-2 md:py-5 rounded-lg md:rounded-2xl font-bold text-base md:text-xl text-white transition-all duration-300 
                        ${availabilityInfo?.availableQuantity === 0
                            ? 'bg-gray-500 cursor-not-allowed' 
                            : 'bg-primary shadow-sm shadow-primary hover:scale-110'
                        }`
                    }
                >
                    {availabilityInfo?.availableQuantity === 0 ? 'Fully Booked' : 'Book Now'}
                </button>
                {/* <button
                    disabled={false}
                    onClick={handleBookNowClick}
                    className={`w-full mt-6 px-6 md:px-[50px] lg:px-[72px] py-2 md:py-5 rounded-lg md:rounded-2xl font-bold text-base md:text-xl text-white transition-all duration-300 
                        ${false
                            ? 'bg-gray-500 cursor-not-allowed' 
                            : 'bg-primary shadow-sm shadow-primary hover:scale-110'
                        }`
                    }
                >
                    {'Book Now'}
                </button> */}
        </div>
    );
}

export default BookRoomCta;