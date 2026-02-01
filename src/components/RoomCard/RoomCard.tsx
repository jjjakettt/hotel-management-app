'use client';

import { Room } from "@/models/room"
import { FC } from "react"
import Image from "next/image";
import Link from "next/link";
import { useTranslation } from "@/libs/translations";

type Props = {
    room: Room;
};

const RoomCard: FC<Props> = props => {
    const {
        room: { coverImage, name, name_vi, price, price_vnd, description, description_vi, slug, quantity },
    } = props;

    const { t, language } = useTranslation();
    const displayName = (language === "vi" && name_vi) ? name_vi : name;
    const displayDesc = (language === "vi" && description_vi) ? description_vi : description;

    return (
        <div className="rounded-xl w-72 mb-10 mx-auto md:mx-0 overflow-hidden text-black">
            <div className="h-60 overflow-hidden">
                <Image
                    src={coverImage.url}
                    alt={displayName}
                    width={250}
                    height={250}
                    className="img scale-animation"
                />
            </div>

            <div className="p-4 bg-white">
                <div className="flex justify-between text-xl font-semibold">
                    <p>{displayName}</p>
                    <p>{(language === "vi" && price_vnd) ? `₫${price_vnd.toLocaleString()}` : `$${price}`}</p>
                </div>
                <p className="text-primary font-medium">{quantity} {t("room.available")}</p>
                <p className="pt-3 pb-6">
                    {displayDesc.slice(1,100)}...
                </p>
                <Link
                    href={`/rooms/${slug.current}`}
                    className="bg-primary inline-block text-center w-full py-4 rounded-xl text-white text-xl font-bold hover:-translate-y-2 hover:shadow-lg transition-all duration-500"
                >
                    {t("booking.bookNow")}
                </Link>
            </div>
        </div>
    )
}

export default RoomCard
