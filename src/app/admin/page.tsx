"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/use-auth";
import {
    Shield,
    Users,
    Building2,
    MessageSquare,
    AlertTriangle,
    TrendingUp,
} from "lucide-react";
import { toast } from "sonner";

interface AdminData {
    stats: {
        totalUsers: number;
        totalProperties: number;
        totalInquiries: number;
        totalReports: number;
        buyers: number;
        sellers: number;
    };
    recentUsers: Array<{
        id: number;
        name: string;
        email: string;
        role: string;
        createdAt: string;
    }>;
    recentProperties: Array<{
        id: number;
        title: string;
        status: string;
        price: number;
        createdAt: string;
        owner: { name: string };
    }>;
}

export default function AdminPage() {
    const { user, isLoading } = useAuth();
    const router = useRouter();
    const [data, setData] = useState<AdminData | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!isLoading && user?.role !== "ADMIN") {
            router.push("/");
            return;
        }
        const fetchAdmin = async () => {
            try {
                const res = await fetch("/api/admin");
                const json = await res.json();
                if (json.success) setData(json.data);
            } catch {
                toast.error("Failed to load admin data");
            } finally {
                setLoading(false);
            }
        };
        if (user?.role === "ADMIN") fetchAdmin();
    }, [user, isLoading, router]);

    if (isLoading || loading) {
        return (
            <div className="max-w-6xl mx-auto px-4 py-8 space-y-6">
                <div className="h-8 w-48 rounded-lg skeleton" />
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {Array.from({ length: 6 }).map((_, i) => <div key={i} className="h-28 rounded-2xl skeleton" />)}
                </div>
            </div>
        );
    }

    if (!data) return null;

    const statCards = [
        { label: "Total Users", value: data.stats.totalUsers, icon: Users, color: "text-blue-600 bg-blue-500/10" },
        { label: "Buyers", value: data.stats.buyers, icon: Users, color: "text-emerald-600 bg-emerald-500/10" },
        { label: "Sellers", value: data.stats.sellers, icon: Users, color: "text-violet-600 bg-violet-500/10" },
        { label: "Properties", value: data.stats.totalProperties, icon: Building2, color: "text-amber-600 bg-amber-500/10" },
        { label: "Inquiries", value: data.stats.totalInquiries, icon: MessageSquare, color: "text-cyan-600 bg-cyan-500/10" },
        { label: "Reports", value: data.stats.totalReports, icon: AlertTriangle, color: "text-red-600 bg-red-500/10" },
    ];

    return (
        <div className="max-w-6xl mx-auto px-4 py-8">
            <h1 className="text-2xl font-bold mb-8 flex items-center gap-2">
                <Shield className="w-6 h-6" />
                Admin Dashboard
            </h1>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
                {statCards.map(({ label, value, icon: Icon, color }) => (
                    <div key={label} className="p-5 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${color}`}>
                            <Icon className="w-5 h-5" />
                        </div>
                        <div className="text-2xl font-bold">{value}</div>
                        <div className="text-sm text-neutral-500 dark:text-neutral-400">{label}</div>
                    </div>
                ))}
            </div>

            <div className="grid lg:grid-cols-2 gap-6">
                {/* Recent Users */}
                <div className="p-6 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800">
                    <h2 className="font-semibold mb-4">Recent Users</h2>
                    <div className="space-y-3">
                        {data.recentUsers.map((u) => (
                            <div key={u.id} className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-neutral-50 dark:hover:bg-neutral-800">
                                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-500 to-amber-500 flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
                                    {u.name.charAt(0)}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="text-sm font-medium truncate">{u.name}</div>
                                    <div className="text-xs text-neutral-400 truncate">{u.email}</div>
                                </div>
                                <span className={`px-2 py-0.5 rounded-md text-xs font-medium ${u.role === "ADMIN" ? "bg-red-500/10 text-red-600" :
                                        u.role === "SELLER" ? "bg-violet-500/10 text-violet-600" :
                                            "bg-blue-500/10 text-blue-600"
                                    }`}>
                                    {u.role}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Recent Properties */}
                <div className="p-6 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800">
                    <h2 className="font-semibold mb-4">Recent Properties</h2>
                    <div className="space-y-3">
                        {data.recentProperties.map((p) => (
                            <div key={p.id} className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-neutral-50 dark:hover:bg-neutral-800">
                                <Building2 className="w-4 h-4 text-neutral-400 flex-shrink-0" />
                                <div className="flex-1 min-w-0">
                                    <div className="text-sm font-medium truncate">{p.title}</div>
                                    <div className="text-xs text-neutral-400">by {p.owner.name}</div>
                                </div>
                                <span className={`px-2 py-0.5 rounded-md text-xs font-medium ${p.status === "ACTIVE" ? "bg-emerald-500/10 text-emerald-600" :
                                        p.status === "SOLD" ? "bg-violet-500/10 text-violet-600" :
                                            "bg-amber-500/10 text-amber-600"
                                    }`}>
                                    {p.status}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
