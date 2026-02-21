"use client";

import { useEffect, useState } from "react";
import { Bell, Check, CheckCheck } from "lucide-react";
import { toast } from "sonner";

interface Notification {
    id: number;
    message: string;
    type: string;
    isRead: boolean;
    createdAt: string;
}

export default function NotificationsPage() {
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchNotifications = async () => {
            try {
                const res = await fetch("/api/notifications");
                const data = await res.json();
                if (data.success) setNotifications(data.data);
            } catch {
                toast.error("Failed to load notifications");
            } finally {
                setLoading(false);
            }
        };
        fetchNotifications();
    }, []);

    const markRead = async (id: number) => {
        try {
            await fetch("/api/notifications", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ notificationId: id }),
            });
            setNotifications(notifications.map((n) => (n.id === id ? { ...n, isRead: true } : n)));
        } catch {
            toast.error("Failed to update");
        }
    };

    return (
        <div className="max-w-3xl mx-auto px-4 py-8">
            <h1 className="text-2xl font-bold mb-6 flex items-center gap-2">
                <Bell className="w-6 h-6" />
                Notifications
            </h1>

            {loading ? (
                <div className="space-y-3">
                    {Array.from({ length: 3 }).map((_, i) => (
                        <div key={i} className="h-20 rounded-2xl skeleton" />
                    ))}
                </div>
            ) : notifications.length === 0 ? (
                <div className="text-center py-20">
                    <Bell className="w-12 h-12 text-neutral-300 dark:text-neutral-600 mx-auto mb-4" />
                    <p className="text-neutral-500 font-medium">No notifications yet</p>
                </div>
            ) : (
                <div className="space-y-3">
                    {notifications.map((n) => (
                        <div
                            key={n.id}
                            className={`p-4 rounded-2xl border flex items-start gap-3 transition-colors ${n.isRead
                                    ? "bg-white dark:bg-neutral-900 border-neutral-200 dark:border-neutral-800"
                                    : "bg-blue-50/50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-800"
                                }`}
                        >
                            <div className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 ${n.isRead ? "bg-neutral-300" : "bg-blue-500"}`} />
                            <div className="flex-1">
                                <p className="text-sm">{n.message}</p>
                                <p className="text-xs text-neutral-400 mt-1">
                                    {new Date(n.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" })}
                                </p>
                            </div>
                            {!n.isRead && (
                                <button
                                    onClick={() => markRead(n.id)}
                                    className="p-1.5 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/30 text-blue-600 dark:text-blue-400 transition-colors flex-shrink-0"
                                    title="Mark as read"
                                >
                                    <Check className="w-4 h-4" />
                                </button>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
