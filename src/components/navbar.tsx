"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/hooks/use-auth";
import { useTheme } from "@/hooks/use-theme";
import {
    Home,
    Building2,
    Heart,
    LayoutDashboard,
    LogIn,
    LogOut,
    UserPlus,
    Moon,
    Sun,
    Menu,
    X,
    Bell,
    User,
    Shield,
} from "lucide-react";
import { useState } from "react";

export function Navbar() {
    const { user, isAuthenticated, signOut } = useAuth();
    const { theme, toggleTheme } = useTheme();
    const pathname = usePathname();
    const [isOpen, setIsOpen] = useState(false);

    const navLinks = [
        { href: "/", label: "Home", icon: Home },
        { href: "/properties", label: "Properties", icon: Building2 },
    ];

    const authLinks = isAuthenticated
        ? [
            ...(user?.role === "SELLER" || user?.role === "ADMIN"
                ? [{ href: "/dashboard", label: "Dashboard", icon: LayoutDashboard }]
                : []),
            { href: "/favorites", label: "Favorites", icon: Heart },
            { href: "/profile", label: "Profile", icon: User },
            ...(user?.role === "ADMIN"
                ? [{ href: "/admin", label: "Admin", icon: Shield }]
                : []),
        ]
        : [
            { href: "/login", label: "Login", icon: LogIn },
            { href: "/signup", label: "Sign Up", icon: UserPlus },
        ];

    const isActive = (href: string) => pathname === href;

    return (
        <nav className="sticky top-0 z-50 glass border-b border-white/10">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-2 group">
                        <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-blue-500 to-amber-500 flex items-center justify-center transition-transform group-hover:scale-110">
                            <Building2 className="w-5 h-5 text-white" />
                        </div>
                        <span className="text-xl font-bold gradient-text hidden sm:block">
                            EstateIQ
                        </span>
                    </Link>

                    {/* Desktop Nav */}
                    <div className="hidden md:flex items-center gap-1">
                        {[...navLinks, ...authLinks].map(({ href, label, icon: Icon }) => (
                            <Link
                                key={href}
                                href={href}
                                className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${isActive(href)
                                    ? "bg-blue-500/15 text-blue-600 dark:text-blue-400"
                                    : "text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800 hover:text-neutral-900 dark:hover:text-white"
                                    }`}
                            >
                                <Icon className="w-4 h-4" />
                                {label}
                            </Link>
                        ))}

                        {isAuthenticated && (
                            <>
                                <Link
                                    href="/notifications"
                                    className="p-2 rounded-lg text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
                                >
                                    <Bell className="w-4 h-4" />
                                </Link>
                                <button
                                    onClick={() => signOut({ callbackUrl: "/" })}
                                    className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors"
                                >
                                    <LogOut className="w-4 h-4" />
                                    Logout
                                </button>
                            </>
                        )}

                        <button
                            onClick={toggleTheme}
                            className="p-2 rounded-lg text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors ml-1"
                        >
                            {theme === "dark" ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
                        </button>
                    </div>

                    {/* Mobile menu button */}
                    <div className="flex items-center gap-2 md:hidden">
                        <button
                            onClick={toggleTheme}
                            className="p-2 rounded-lg text-neutral-600 dark:text-neutral-400"
                        >
                            {theme === "dark" ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
                        </button>
                        <button
                            onClick={() => setIsOpen(!isOpen)}
                            className="p-2 rounded-lg text-neutral-600 dark:text-neutral-400"
                        >
                            {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                        </button>
                    </div>
                </div>

                {/* Mobile nav */}
                {isOpen && (
                    <div className="md:hidden pb-4 space-y-1">
                        {[...navLinks, ...authLinks].map(({ href, label, icon: Icon }) => (
                            <Link
                                key={href}
                                href={href}
                                onClick={() => setIsOpen(false)}
                                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${isActive(href)
                                    ? "bg-blue-500/15 text-blue-600 dark:text-blue-400"
                                    : "text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800"
                                    }`}
                            >
                                <Icon className="w-4 h-4" />
                                {label}
                            </Link>
                        ))}
                        {isAuthenticated && (
                            <button
                                onClick={() => {
                                    signOut({ callbackUrl: "/" });
                                    setIsOpen(false);
                                }}
                                className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 w-full transition-colors"
                            >
                                <LogOut className="w-4 h-4" />
                                Logout
                            </button>
                        )}
                    </div>
                )}
            </div>
        </nav>
    );
}
