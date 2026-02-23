"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
    LayoutDashboard,
    Building2,
    Eye,
    MessageSquare,
    PlusCircle,
    TrendingUp,
    ArrowUpRight,
} from "lucide-react";
import { toast } from "sonner";

interface DashboardData {
    stats: {
        totalProperties: number;
        active: number;
        sold: number;
        rented: number;
        totalViews: number;
        totalInquiries: number;
    };
    recentProperties: Array<{
        id: number;
        title: string;
        price: number;
        status: string;
        viewsCount: number;
        images: string[];
        createdAt: string;
        _count: { inquiries: number };
    }>;
}

export default function DashboardPage() {
    const { user, isAuthenticated, isLoading } = useAuth();
    const router = useRouter();
    const [data, setData] = useState<DashboardData | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!isLoading && !isAuthenticated) {
            router.push("/login");
            return;
        }
        const fetchDashboard = async () => {
            try {
                const res = await fetch("/api/dashboard");
                const json = await res.json();
                if (json.success) setData(json.data);
            } catch {
                toast.error("Failed to load dashboard");
            } finally {
                setLoading(false);
            }
        };
        if (isAuthenticated) fetchDashboard();
    }, [isAuthenticated, isLoading, router]);

    if (isLoading || loading) {
        return (
            <div className="max-w-6xl mx-auto px-4 py-8 space-y-6">
                <div className="h-8 w-48 rounded-lg skeleton" />
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {Array.from({ length: 6 }).map((_, i) => (
                        <div key={i} className="h-28 rounded-2xl skeleton" />
                    ))}
                </div>
            </div>
        );
    }

    if (!data) return null;

    const statCards = [
        { label: "Total Properties", value: data.stats.totalProperties, icon: Building2, color: "text-blue-600 bg-blue-500/10" },
        { label: "Active", value: data.stats.active, icon: TrendingUp, color: "text-emerald-600 bg-emerald-500/10" },
        { label: "Sold", value: data.stats.sold, icon: ArrowUpRight, color: "text-violet-600 bg-violet-500/10" },
        { label: "Rented", value: data.stats.rented, icon: Building2, color: "text-amber-600 bg-amber-500/10" },
        { label: "Total Views", value: data.stats.totalViews, icon: Eye, color: "text-pink-600 bg-pink-500/10" },
        { label: "Inquiries", value: data.stats.totalInquiries, icon: MessageSquare, color: "text-cyan-600 bg-cyan-500/10" },
    ];

    const formatPrice = (price: number) => {
        if (price >= 10000000) return `₹${(price / 10000000).toFixed(1)}Cr`;
        if (price >= 100000) return `₹${(price / 100000).toFixed(1)}L`;
        return `₹${price.toLocaleString()}`;
    };

    return (
        <div className="max-w-6xl mx-auto px-4 py-8">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-xl sm:text-2xl font-bold flex items-center gap-2">
                        <LayoutDashboard className="w-5 h-5 sm:w-6 sm:h-6" />
                        Dashboard
                    </h1>
                    <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-1">
                        Welcome back, {user?.name}!
                    </p>
                </div>
                <Link
                    href="/properties/new"
                    className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-blue-500 text-white text-sm font-medium hover:shadow-lg hover:shadow-blue-500/25 transition-all w-full sm:w-auto"
                >
                    <PlusCircle className="w-4 h-4" />
                    Add Property
                </Link>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4 mb-8">
                {statCards.map(({ label, value, icon: Icon, color }) => (
                    <div
                        key={label}
                        className="p-5 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 hover:shadow-md transition-shadow"
                    >
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${color}`}>
                            <Icon className="w-5 h-5" />
                        </div>
                        <div className="text-xl sm:text-2xl font-bold">{value}</div>
                        <div className="text-sm text-neutral-500 dark:text-neutral-400">{label}</div>
                    </div>
                ))}
            </div>

            {/* Recent Properties */}
            <div className="p-6 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800">
                <h2 className="text-lg font-semibold mb-4">Recent Properties</h2>
                {data.recentProperties.length === 0 ? (
                    <p className="text-neutral-500 dark:text-neutral-400 text-center py-8">
                        No properties yet. Start by adding your first listing!
                    </p>
                ) : (
                    <div className="space-y-3">
                        {data.recentProperties.map((prop) => (
                            <Link
                                key={prop.id}
                                href={`/properties/${prop.id}`}
                                className="flex items-center gap-4 p-3 rounded-xl hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors"
                            >
                                <img
                                    src={(prop.images as string[])?.[0] || "https://placehold.co/80x60/e2e8f0/94a3b8?text=No+Img"}
                                    alt={prop.title}
                                    className="w-20 h-14 rounded-lg object-cover flex-shrink-0"
                                />
                                <div className="flex-1 min-w-0">
                                    <div className="font-medium truncate">{prop.title}</div>
                                    <div className="text-sm text-neutral-500">{formatPrice(prop.price)}</div>
                                </div>
                                <div className="hidden sm:flex items-center gap-4 text-xs text-neutral-400 flex-shrink-0">
                                    <span className="flex items-center gap-1">
                                        <Eye className="w-3 h-3" /> {prop.viewsCount}
                                    </span>
                                    <span className="flex items-center gap-1">
                                        <MessageSquare className="w-3 h-3" /> {prop._count.inquiries}
                                    </span>
                                    <span className={`px-2 py-1 rounded-md text-xs font-medium ${prop.status === "ACTIVE" ? "bg-emerald-500/10 text-emerald-600" :
                                        prop.status === "SOLD" ? "bg-violet-500/10 text-violet-600" :
                                            "bg-amber-500/10 text-amber-600"
                                        }`}>
                                        {prop.status}
                                    </span>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
