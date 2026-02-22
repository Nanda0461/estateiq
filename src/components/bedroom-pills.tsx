"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface BedroomPillsProps {
    selected: string;
    onChange: (value: string) => void;
}

const options = [
    { value: "", label: "Any" },
    { value: "1", label: "1" },
    { value: "2", label: "2" },
    { value: "3", label: "3" },
    { value: "4", label: "4+" },
];

export function BedroomPills({ selected, onChange }: BedroomPillsProps) {
    return (
        <div className="flex gap-2">
            {options.map((option) => {
                const isActive = selected === option.value;

                return (
                    <motion.button
                        key={option.value}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => onChange(option.value)}
                        className={cn(
                            "relative flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 border",
                            isActive
                                ? "bg-blue-600 border-blue-600 text-white shadow-lg shadow-blue-500/25"
                                : "bg-white dark:bg-neutral-900 border-neutral-200 dark:border-neutral-800 text-neutral-600 dark:text-neutral-400 hover:border-blue-300 dark:hover:border-blue-700 hover:bg-blue-50/50 dark:hover:bg-blue-500/5"
                        )}
                    >
                        {option.label}
                        {isActive && (
                            <motion.div
                                layoutId="pill-glow"
                                className="absolute inset-0 rounded-xl bg-blue-400/20 blur-md opacity-50"
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
