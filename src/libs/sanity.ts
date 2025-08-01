import { createClient } from "next-sanity";

const sanityClient = createClient({
    projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
    dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
    useCdn: process.env.NODE_ENV === "production",
    token: process.env.SANITY_STUDIO_TOKEN,
    apiVersion: "2025-07-01",
});

export default sanityClient;
export function getFeaturedRoomQuery(getFeaturedRoomQuery: any, arg1: {}) {
    throw new Error("Function not implemented.");
}

