import { Room } from "@/models/room";
import sanityClient from "./sanity";
import * as queries from "./sanityQueries"

export async function getFeaturedRoom() { 
    const result = await sanityClient.fetch<Room>(
        queries.getFeaturedRoomQuery,
        {}, 
        // { next: { revalidate: 1800 } } // 1800s -> 30 mins
        { cache: 'no-cache' } // function gets called on every request -> dev mode (remove later)
    );

    return result;
}

export async function getRooms(){
    const result = await sanityClient.fetch<Room[]>(queries.getRoomsQuery);
    return result;
}