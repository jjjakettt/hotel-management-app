'use client';

import { Dispatch, FC, SetStateAction } from "react";
import DatePicker from "react-datepicker";

import 'react-datepicker/dist/react-datepicker.css';

type Props = {
    price: number;
    discount: number;
    specialNote: string;
    checkinDate: Date | null;
    setCheckinDate: Dispatch<SetStateAction<Date | null>>;
    checkoutDate: Date | null;
    setCheckoutDate: Dispatch<SetStateAction<Date | null>>;
    calcMinCheckoutDate: () => Date | null;
}
const BookRoomCta: FC<Props> = props => {

    const { 
        price, 
        discount, 
        specialNote,
        checkinDate,
        setCheckinDate,
        checkoutDate,
        setCheckoutDate,
        calcMinCheckoutDate,
    } = props;

    const discountPrice = price - (price / 100) * discount;

    
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
                        id='check-in-date'
                        className='w-full border text-[var(--foreground-secondary)] border-gray-300 rounded-lg p-2.5 focus:ring-primary focus:border-primary'
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
                        id='check-out-date'
                        className='w-full border text-[var(--foreground-secondary)] border-gray-300 rounded-lg p-2.5 focus:ring-primary focus:border-primary'
                    />
                </div>
{/* 
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
                    </div>
                </div> */}
            </div>
        </div>
    );
}

export default BookRoomCta;