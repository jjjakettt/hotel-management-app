'use client';

import { Dispatch, FC, SetStateAction } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslation } from '@/libs/translations';

import { Booking } from '@/models/booking';

type Props = {
    bookingDetails: Booking[];
    setRoomId: Dispatch<SetStateAction<string | null>>;
    toggleRatingModal: () => void;
};

const Table: FC<Props> = ({ bookingDetails, setRoomId, toggleRatingModal }) => {
    const router = useRouter();
    const { t, language } = useTranslation();

    return (
        <div className='overflow-x-auto max-w-[340px] rounded-lg mx-auto md:max-w-full shadow-md sm:rounded-lg'>
        <table className='w-full text-sm text-left text-gray-500'>
            <thead className='text-xs text-gray-700 uppercase bg-gray-50'>
            <tr>
                <th className='px-6 py-3'>{t("table.roomName")}</th>
                <th className='px-6 py-3'>{t("table.unitPrice")}</th>
                <th className='px-6 py-3'>{t("table.price")}</th>
                <th className='px-6 py-3'>{t("table.discount")}</th>
                <th className='px-6 py-3'>{t("table.daysBooked")}</th>
                <th className='px-6 py-3'>{t("table.quantity")}</th>
                <th className='px-6 py-3'></th>
            </tr>
            </thead>
            <tbody>
            {bookingDetails.map(booking => (

                <tr key={booking._id} className='bg-white border-b hover:bg-gray-50'>
                    <th onClick= {() =>
                            router.push(`/rooms/${booking.hotelRoom.slug.current}`)
                        }
                        className='px-6 underline text-blue-600 cursor-pointer py-4 font-medium whitespace-nowrap'>
                        {(language === "vi" && booking.hotelRoom.name_vi) ? booking.hotelRoom.name_vi : booking.hotelRoom.name}
                    </th>
                    <td className='px-6 py-4'>{booking.hotelRoom.price}</td>
                    <td className='px-6 py-4'>{booking.totalPrice}</td>
                    <td className='px-6 py-4'>{booking.discount}</td>
                    <td className='px-6 py-4'>{booking.numberOfDays}</td>
                    <td className='px-6 py-4'>{booking.quantity}</td>
                    <td className='px-6 py-4'>
                    <button
                        onClick={() => {
                            setRoomId(booking.hotelRoom._id);
                            toggleRatingModal()
                        }}
                        className='font-medium text-blue-600 hover:underline'
                    >
                        {t("table.rate")}
                    </button>
                </td>
                </tr>
            ))}

            </tbody>
        </table>
        </div>
    );
};

export default Table;
