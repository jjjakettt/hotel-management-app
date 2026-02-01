'use client';
import { useRouter } from "next/navigation";
import { ChangeEvent, FC } from "react";
import { useTranslation } from "@/libs/translations";

type Props = {
    roomTypeFilter: string;
    searchQuery: string;
    setRoomTypeFilter: (value: string) => void;
    setSearchQuery: (value: string) => void;
}

const Search: FC<Props> = ({
    roomTypeFilter,
    searchQuery,
    setRoomTypeFilter,
    setSearchQuery,
    }) => {
        const router = useRouter();
        const { t } = useTranslation();

        const handleRoomTypeChange = (event: ChangeEvent<HTMLSelectElement>) => {
            setRoomTypeFilter(event.target.value);
        };
        const handleSearchQueryChange = (event: ChangeEvent<HTMLInputElement>) => {
            setSearchQuery(event.target.value);
        };
        const handleFilterClick = () => {
            router.push(`/rooms?roomType=${roomTypeFilter}&searchQuery=${searchQuery}`);
        };

        return (
            <section className="bg-tertiary-light px-4 py-6 rounded-lg">
                <div className="container mx-auto flex gap-4 justify-between items-center">
                    <div className="w-full md:1/3 lg:w-auto mb-4 md:mb-0">
                        <label className="block text-sm font-medium mb-2 text-black">
                            {t("search.roomType")}
                        </label>
                        <div className="relative">
                            <select
                                value = {roomTypeFilter}
                                onChange={handleRoomTypeChange}
                                className="w-full px-4 py-2 capitalize rounded leading-tight bg-[var(--background)] text-[var(--foreground)] focus:outline-none cursor-pointer">
                                <option value="All">{t("search.all")}</option>
                                <option value="Deluxe">{t("search.deluxe")}</option>
                                <option value="Premium">{t("search.premium")}</option>
                                <option value="Suite">{t("search.suite")}</option>
                                <option value="Presidential">{t("search.presidential")}</option>
                            </select>
                        </div>
                    </div>
                    <div className="w-full md:1/3 lg:w-auto mb-4 md:mb-0">
                        <label className="block text-sm font-medium mb-2 text-black">{t("search.search")}</label>
                        <input
                            type="text"
                            id="search"
                            placeholder={t("search.placeholder")}
                            className="w-full px-4 py-3 rounded leading-tight  bg-[var(--background)] focus:outline-none placeholder:text-[var(--foreground)] text-[var(--foreground)]"
                            value={searchQuery}
                            onChange={handleSearchQueryChange}
                        />
                    </div>
                    <button
                    className="btn-primary"
                    type="button"
                    onClick={handleFilterClick}

                    >{t("search.search")}</button>
                </div>

            </section>
        )
}

export default Search
