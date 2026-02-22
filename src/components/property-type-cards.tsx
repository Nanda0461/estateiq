"use client";

import { Building2, Home, DollarSign, MapPin, LucideIcon } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface PropertyType {
    value: string;
    label: string;
    icon: LucideIcon;
}

const propertyTypes: PropertyType[] = [
    { value: "", label: "All Types", icon: Building2 },
    { value: "APARTMENT", label: "Apartment", icon: Building2 },
    { value: "HOUSE", label: "House", icon: Home },
    { value: "COMMERCIAL", label: "Commercial", icon: DollarSign },
    { value: "LAND", label: "Land", icon: MapPin },
];

interface PropertyTypeCardsProps {
    selected: string;
    onChange: (value: string) => void;
}

export function PropertyTypeCards({ selected, onChange }: PropertyTypeCardsProps) {
    return (
        <div className="grid grid-cols-2 gap-3">
            {propertyTypes.map((type) => {
                const Icon = type.icon;
                const isActive = selected === type.value;

                return (
                    <motion.button
                        key={type.value}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => onChange(type.value)}
                        className={cn(
                            "relative flex flex-col items-center justify-center p-4 rounded-2xl border transition-all duration-300",
                            isActive
                                ? "bg-blue-500/10 border-blue-500 shadow-[0_0_15px_rgba(59,130,246,0.2)] text-blue-600 dark:text-blue-400"
                                : "bg-neutral-50 dark:bg-neutral-900 border-neutral-200 dark:border-neutral-800 text-neutral-600 dark:text-neutral-400 hover:border-blue-300 dark:hover:border-blue-700"
                        )}
                    >
                        <Icon className={cn("w-6 h-6 mb-2", isActive && "animate-pulse")} />
                        <span className="text-xs font-semibold uppercase tracking-wider">{type.label}</span>

                        {isActive && (
                            <motion.div
                                layoutId="active-bg"
                                className="absolute inset-0 rounded-2xl border-2 border-blue-500/50"
                                initial={false}
                                transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                            />
                        )}
                    </motion.button>
                );
            })}
        </div>
    );
}
