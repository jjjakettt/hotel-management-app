'use client';

import {
    Chart as ChartJS,
    Tooltip,
    CategoryScale,
    LinearScale,
    BarElement,
} from 'chart.js';
import { FC } from 'react';
import { Bar } from 'react-chartjs-2';

import { Booking } from '@/models/booking';
import { useTranslation } from '@/libs/translations';

ChartJS.register(Tooltip, CategoryScale, LinearScale, BarElement);

export const options = {
    responsive: true,
    plugins: {
        legend: {
        position: 'top' as const,
        },
    },
};

const Chart: FC<{ userBookings: Booking[] }> = ({ userBookings }) => {
    const { t, language } = useTranslation();

    // Only chart in VND when every room has a VND price — a bar chart can't mix currencies
    const useVnd = language === 'vi' && userBookings.length > 0
        && userBookings.every(booking => booking.hotelRoom.price_vnd);

    const labels = userBookings.map(booking =>
        (language === 'vi' && booking.hotelRoom.name_vi) ? booking.hotelRoom.name_vi : booking.hotelRoom.name
    );
    const amountSpent = userBookings.map(booking => {
        if (!useVnd) return booking.totalPrice;
        const unitPrice = booking.hotelRoom.price_vnd!;
        const discountedUnit = unitPrice - (unitPrice / 100) * booking.discount;
        return discountedUnit * booking.numberOfDays * booking.quantity;
    });

    return (
        <Bar
        options={options}
        data={{
            labels,
            datasets: [
            {
                label: `${t("user.amountSpent")} (${useVnd ? '₫' : '$'})`,
                data: amountSpent,
                borderWidth: 1,
                backgroundColor: '#F27405',
                hoverBackgroundColor: '#F2C641',
            },
            ],
        }}
        />
    );
};

export default Chart;
