"use client";

import { useSession, signIn, signOut } from "next-auth/react";

export function useAuth() {
    const { data: session, status } = useSession();

    const user = session?.user
        ? {
            id: session.user.id,
            name: session.user.name,
            email: session.user.email,
            role: (session.user as { role?: string }).role || "BUYER",
        }
        : null;

    return {
        user,
        isAuthenticated: !!session?.user,
        isLoading: status === "loading",
        signIn,
        signOut,
    };
}
