import { NextAuthOptions } from "next-auth";
import { SanityCredentials, SanityAdapter } from "next-auth-sanity";
import GoogleProvider from "next-auth/providers/google"
import sanityClient from "./sanity";
import user from "../../schemaTypes/user";

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
    callbacks: {
        session: async ({session, token}) => {
            const userEmail = token.email;
            const userImage = token.picture;
            const userIdObj = await sanityClient.fetch<{ _id: string }>(
                `*[_type == "user" && email == $email][0] {
                    _id
                }`, 
                { email: userEmail }
            );
           
            return {
                ...session,
                user: {
                    ...session.user,
                    id: userIdObj._id,
                    image: userImage,
                }
            }
        },
    },
};
