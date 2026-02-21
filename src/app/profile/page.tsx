"use client";

import { useAuth } from "@/hooks/use-auth";
import { User, Mail, Shield, Calendar } from "lucide-react";

export default function ProfilePage() {
    const { user, isLoading } = useAuth();

    if (isLoading) {
        return (
            <div className="max-w-2xl mx-auto px-4 py-8 space-y-4">
                <div className="h-24 w-24 rounded-full skeleton mx-auto" />
                <div className="h-6 w-48 rounded-lg skeleton mx-auto" />
                <div className="h-4 w-32 rounded-lg skeleton mx-auto" />
            </div>
        );
    }

    if (!user) return null;

    return (
        <div className="max-w-2xl mx-auto px-4 py-12">
            <div className="text-center mb-8">
                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-500 to-amber-500 flex items-center justify-center mx-auto mb-4">
                    <span className="text-3xl font-bold text-white">
                        {user.name?.charAt(0).toUpperCase()}
                    </span>
                </div>
                <h1 className="text-2xl font-bold">{user.name}</h1>
                <p className="text-neutral-500 dark:text-neutral-400 text-sm capitalize">
                    {user.role?.toLowerCase()} Account
                </p>
            </div>

            <div className="p-6 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 space-y-4">
                <div className="flex items-center gap-3 p-3 rounded-xl bg-neutral-50 dark:bg-neutral-800">
                    <User className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                    <div>
                        <div className="text-xs text-neutral-500">Full Name</div>
                        <div className="font-medium">{user.name}</div>
                    </div>
                </div>
                <div className="flex items-center gap-3 p-3 rounded-xl bg-neutral-50 dark:bg-neutral-800">
                    <Mail className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                    <div>
                        <div className="text-xs text-neutral-500">Email</div>
                        <div className="font-medium">{user.email}</div>
                    </div>
                </div>
                <div className="flex items-center gap-3 p-3 rounded-xl bg-neutral-50 dark:bg-neutral-800">
                    <Shield className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                    <div>
                        <div className="text-xs text-neutral-500">Role</div>
                        <div className="font-medium capitalize">{user.role?.toLowerCase()}</div>
                    </div>
                </div>
            </div>
        </div>
    );
}
