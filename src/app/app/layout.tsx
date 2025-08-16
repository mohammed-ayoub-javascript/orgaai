import { auth } from "@/lib/auth";
import React from "react";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export default async function ChatLayout({ children }: { children: React.ReactNode }) {
    const session = await auth.api.getSession({
        query: {
            disableCookieCache: true,
        },
        headers: headers() as any, 
    });

    if(!session?.session.token){
        redirect("/auth/sigin-in");
    }

    return <>{children}</>;
}
