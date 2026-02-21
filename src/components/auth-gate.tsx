"use client";

import { useAuth } from "@/hooks/use-auth";
import { Lock, Sparkles } from "lucide-react";
import Link from "next/link";
import { ReactNode } from "react";

interface AuthGateProps {
    children: ReactNode;
    message?: string;
    description?: string;
}

export function AuthGate({
    children,
    message = "Premium AI Feature",
    description = "Sign in to unlock our intelligent real estate analysis tools."
}: AuthGateProps) {
    const { isAuthenticated, isLoading } = useAuth();

    if (isLoading) {
        return (
            <div className="w-full h-48 rounded-2xl bg-neutral-100 dark:bg-neutral-900 animate-pulse flex items-center justify-center">
                <div className="flex flex-col items-center gap-2">
                    <Sparkles className="w-8 h-8 text-neutral-300 animate-spin" />
                    <div className="h-4 w-24 bg-neutral-200 dark:bg-neutral-800 rounded" />
                </div>
            </div>
        );
    }

    if (isAuthenticated) {
        return <>{children}</>;
    }

    return (
        <div className="relative group overflow-hidden rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900">
            {/* Blurred Content Preview */}
            <div className="blur-md opacity-40 select-none pointer-events-none">
                {children}
            </div>

            {/* Overlay */}
            <div className="absolute inset-0 z-10 flex flex-col items-center justify-center p-6 text-center bg-white/40 dark:bg-black/40 backdrop-blur-sm transition-all group-hover:bg-white/50 dark:group-hover:bg-black/50">
                <div className="w-12 h-12 mb-4 rounded-xl bg-gradient-to-br from-blue-600 to-amber-500 flex items-center justify-center shadow-lg shadow-blue-500/20">
                    <Lock className="w-6 h-6 text-white" />
                </div>

                <h3 className="text-xl font-bold mb-2 flex items-center gap-2">
                    {message}
                    <Sparkles className="w-4 h-4 text-amber-500" />
                </h3>

                <p className="text-sm text-neutral-600 dark:text-neutral-400 max-w-[250px] mb-6">
                    {description}
                </p>

                <div className="flex flex-col sm:flex-row gap-3">
                    <Link
                        href="/login"
                        className="px-6 py-2 rounded-xl bg-blue-600 text-white text-sm font-bold hover:bg-blue-700 transition-all hover:scale-105"
                    >
                        Sign In
                    </Link>
                    <Link
                        href="/signup"
                        className="px-6 py-2 rounded-xl border border-neutral-200 dark:border-neutral-700 text-neutral-900 dark:text-neutral-100 text-sm font-bold hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-all"
                    >
                        Create Account
                    </Link>
                </div>
            </div>
        </div>
    );
}
