"use client";

import { SessionProvider } from "next-auth/react";
import { Props } from "next/script";

type Props = {
    children: React.ReactNode;
}

export const NextAuthProvider = ({children}: Props) => {
    return <SessionProvider>{children}</SessionProvider>;
}

