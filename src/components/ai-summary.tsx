"use client";

import { Brain, Sparkles, TrendingUp } from "lucide-react";
import { motion } from "framer-motion";

interface AISummaryProps {
    total: number;
    filters: any;
}

export function AISummary({ total, filters }: AISummaryProps) {
    if (total === 0) return null;

    // Simulate AI summary content based on filters
    const getSummary = () => {
        if (filters.type === "APARTMENT") return "Apartments in this range are currently seeing a 4.2% month-on-month increase in demand.";
        if (filters.type === "HOUSE") return "Independent houses are highly sought after in suburban areas with 12% annual appreciation.";
        return "The market for these properties is stable, with an average time-to-sale of 42 days in the current quarter.";
    };

    return (
        <div
            className="flex items-start gap-4 p-5 rounded-2xl bg-white dark:bg-neutral-900 border border-blue-500/20 dark:border-blue-500/20 shadow-sm mb-8"
        >
            <div className="p-2 rounded-xl bg-blue-500/10 text-blue-600">
                <Brain className="w-5 h-5" />
            </div>
            <div>
                <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-black text-neutral-400 dark:text-neutral-500 uppercase tracking-widest">AI Market Summary</span>
                    <div className="flex items-center gap-1 px-1.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 text-[9px] font-bold uppercase">
                        <TrendingUp className="w-2.5 h-2.5" />
                        Live
                    </div>
                </div>
                <p className="text-sm text-neutral-700 dark:text-neutral-300 font-medium leading-relaxed">
                    {getSummary()}
                </p>
                <div className="flex gap-4 mt-3">
                    <div className="flex items-center gap-1.5 text-[10px] text-neutral-400 font-bold uppercase tracking-tighter">
                        <Sparkles className="w-3 h-3 text-amber-500" />
                        High Match Score
                    </div>
                    <div className="flex items-center gap-1.5 text-[10px] text-neutral-400 font-bold uppercase tracking-tighter">
                        <Sparkles className="w-3 h-3 text-blue-500" />
                        Hot Market
                    </div>
                </div>
            </div>
        </div>
    );
}
