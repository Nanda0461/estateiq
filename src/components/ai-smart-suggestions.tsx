"use client";

import { useState } from "react";
import { Sparkles, ArrowRight, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface AISmartSuggestionsProps {
    onApplyFilters: (filters: any) => void;
    isLoading?: boolean;
}

export function AISmartSuggestions({ onApplyFilters, isLoading: parentLoading }: AISmartSuggestionsProps) {
    const [query, setQuery] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const handleSearch = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!query.trim()) return;

        setIsLoading(true);
        try {
            // Simulate AI extraction logic for now or call real AI endpoint
            // In a real app, this would call an AI route that returns structured filter data
            const res = await fetch("/api/ai/recommend", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ preferences: query }),
            });
            const data = await res.json();

            // apply extracted filters if they exist
            if (data.filters) {
                onApplyFilters(data.filters);
            } else {
                // Fallback to simple search if no structured filters were extracted
                onApplyFilters({ search: query });
            }
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="relative mb-10">
            <div
                className="relative overflow-hidden rounded-[2rem] bg-indigo-700 p-8 shadow-2xl"
            >
                <div className="relative z-10 max-w-2xl">
                    <div className="flex items-center gap-2 mb-4">
                        <div className="flex items-center justify-center w-6 h-6 rounded-full bg-white/20">
                            <Sparkles className="w-3.5 h-3.5 text-white" />
                        </div>
                        <span className="text-xs font-black text-white/90 uppercase tracking-[0.2em]">AI Smart Suggestions</span>
                    </div>

                    <h2 className="text-3xl font-black text-white mb-6 leading-tight">
                        Describe your <span className="text-blue-200">ideal home</span>, and let AI do the rest.
                    </h2>

                    <form onSubmit={handleSearch} className="relative group">
                        <input
                            type="text"
                            placeholder="e.g. 'Quiet 3BHK near IT park under 80L'"
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            className="w-full h-16 pl-6 pr-16 rounded-2xl bg-white/10 border border-white/20 text-white placeholder:text-white/40 outline-none focus:ring-4 focus:ring-white/10 transition-all text-lg"
                        />
                        <button
                            type="submit"
                            disabled={isLoading || parentLoading}
                            className="absolute right-2 top-2 h-12 w-12 rounded-xl bg-white text-blue-600 flex items-center justify-center shadow-xl disabled:opacity-50"
                        >
                            {isLoading || parentLoading ? (
                                <Loader2 className="w-5 h-5 animate-spin" />
                            ) : (
                                <ArrowRight className="w-5 h-5" />
                            )}
                        </button>
                    </form>

                    <div className="flex flex-wrap gap-2 mt-4">
                        {["2 BHK in Mumbai", "Apartment near Tech Hub", "Luxury Villa"].map((tag) => (
                            <button
                                key={tag}
                                onClick={() => setQuery(tag)}
                                className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[10px] font-bold text-white/60 hover:bg-white/10 hover:text-white transition-all"
                            >
                                {tag}
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
