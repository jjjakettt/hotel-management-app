'use client';
import { useRouter } from "next/navigation";
import { ChangeEvent, FC } from "react";

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
        const handleRoomTypeChange = (event: ChangeEvent<HTMLSelectElement>) => {
            setRoomTypeFilter(event.target.value);
        };
        const handleSearchQueryChange = (event: ChangeEvent<HTMLInputElement>) => {
            setSearchQuery(event.target.value);
        };
        const handleFilterClick = () => {
            // Navigate to the rooms page with the query
            router.push(`/rooms?roomType=${roomTypeFilter}&searchQuery=${searchQuery}`);
        };

        return (
            <section className="bg-tertiary-light px-4 py-6 rounded-lg">
                <div className="container mx-auto flex gap-4 justify-between items-center">
                    <div className="w-full md:1/3 lg:w-auto mb-4 md:mb-0">
                        <label className="block text-sm font-medium mb-2 text-black">
                            Room Type
                        </label>
                        <div className="relative">
                            <select 
                                value = {roomTypeFilter}
                                onChange={handleRoomTypeChange} 
                                className="w-full px-4 py-2 capitalize rounded leading-tight bg-[var(--background)] text-[var(--foreground)] focus:outline-none cursor-pointer">
                                <option value="All">All</option>
                                <option value="Deluxe">Deluxe</option>
                                <option value="Premium">Premium</option>
                                <option value="Suite">Suite</option>
                                <option value="Presidential">Presidential</option>
                            </select>
                        </div>
                    </div>
                    <div className="w-full md:1/3 lg:w-auto mb-4 md:mb-0">  
                        <label className="block text-sm font-medium mb-2 text-black">Search</label>
                        <input 
                            type="text" 
                            id="search" 
                            placeholder="Search..."
                            className="w-full px-4 py-3 rounded leading-tight  bg-[var(--background)] focus:outline-none placeholder:text-[var(--foreground)] text-[var(--foreground)]"  
                            value={searchQuery}
                            onChange={handleSearchQueryChange}
                        />
                    </div>
                    <button 
                    className="btn-primary" 
                    type="button" 
                    onClick={handleFilterClick}

                    >Search</button>
                </div>
                
            </section>
        )
}

export default Search