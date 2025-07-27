import { NextAuthOptions } from "next-auth";
import { SanityCredentials, SanityAdapter } from "next-auth-sanity";
import GoogleProvider from "next-auth/providers/google"
import sanityClient from "./sanity";

export const authOptions: NextAuthOptions = {
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID as string,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET as string
        }),
        SanityCredentials(sanityClient),
    ],
    session: {
        strategy: 'jwt',
    },
    adapter: SanityAdapter(sanityClient),
    debug: process.env.NODE_ENV === "development",
    secret: process.env.NEXTAUTH_SECRET,
    callbacks: {},
};
