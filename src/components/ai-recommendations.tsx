"use client";

import { useState, useEffect } from "react";
import { Sparkles, ArrowRight, Target, Loader2, RefreshCw } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

interface Recommendation {
    suggestion: string;
    reasoning: string;
    priceRange: string;
    matchScore: number;
}

export function AIRecommendations() {
    const [preferences, setPreferences] = useState("");
    const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
    const [summary, setSummary] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const getRecommendations = async () => {
        if (!preferences.trim()) return;
        setLoading(true);
        setError(null);
        try {
            const res = await fetch("/api/ai/recommend", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ preferences }),
            });
            const data = await res.json();
            if (data.error) throw new Error(data.error);
            setRecommendations(data.recommendations);
            setSummary(data.summary);
        } catch (err: any) {
            setError(err.message || "Failed to get recommendations");
        } finally {
            setLoading(false);
        }
    };

    return (
        <section className="py-12 relative overflow-hidden">
            {/* Background elements */}
            <div className="absolute top-0 right-0 -z-10 w-96 h-96 bg-blue-500/5 blur-[120px] rounded-full" />
            <div className="absolute bottom-0 left-0 -z-10 w-96 h-96 bg-amber-500/5 blur-[120px] rounded-full" />

            <div className="max-w-6xl mx-auto px-4">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
                    <div>
                        <div className="flex items-center gap-2 mb-2">
                            <span className="px-2 py-0.5 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-[10px] font-black uppercase tracking-widest">Powered by EstateIQ AI</span>
                            <Sparkles className="w-4 h-4 text-amber-500" />
                        </div>
                        <h2 className="text-3xl font-bold">Personalized AI Picks</h2>
                        <p className="text-neutral-600 dark:text-neutral-400">Tell us what you're looking for, and our AI will find the perfect match.</p>
                    </div>

                    <div className="flex-1 max-w-md w-full">
                        <div className="relative">
                            <input
                                type="text"
                                value={preferences}
                                onChange={(e) => setPreferences(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && getRecommendations()}
                                placeholder="e.g. Quiet 3BHK for a family near tech parks..."
                                className="w-full pl-4 pr-12 py-3 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl shadow-sm outline-none focus:border-blue-500 transition-colors"
                            />
                            <button
                                onClick={getRecommendations}
                                disabled={loading || !preferences.trim()}
                                className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors disabled:opacity-50"
                            >
                                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <ArrowRight className="w-5 h-5" />}
                            </button>
                        </div>
                    </div>
                </div>

                <AnimatePresence mode="wait">
                    {loading && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6"
                        >
                            {[1, 2, 3].map((i) => (
                                <div key={i} className="h-64 rounded-2xl bg-neutral-100 dark:bg-neutral-900 skeleton" />
                            ))}
                        </motion.div>
                    )}

                    {error && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="p-8 rounded-2xl bg-red-50 dark:bg-red-950/20 text-red-600 border border-red-200 text-center"
                        >
                            <p>{error}</p>
                            <button onClick={getRecommendations} className="mt-4 flex items-center gap-2 mx-auto text-sm font-bold">
                                <RefreshCw className="w-4 h-4" /> Try Again
                            </button>
                        </motion.div>
                    )}

                    {!loading && recommendations.length > 0 && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="space-y-8"
                        >
                            {summary && (
                                <div className="p-4 rounded-xl bg-blue-50/50 dark:bg-blue-950/20 border border-blue-100/50 dark:border-blue-900/30">
                                    <p className="text-sm font-medium italic text-blue-800 dark:text-blue-300">"{summary}"</p>
                                </div>
                            )}

                            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                {recommendations.map((rec, i) => (
                                    <motion.div
                                        key={i}
                                        whileHover={{ y: -5 }}
                                        className="p-6 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-sm hover:shadow-xl hover:shadow-blue-500/5 transition-all flex flex-col"
                                    >
                                        <div className="flex justify-between items-start mb-4">
                                            <div className="p-2 rounded-lg bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400">
                                                <Target className="w-5 h-5" />
                                            </div>
                                            <div className="text-right">
                                                <div className="text-2xl font-black text-blue-600 dark:text-blue-400">{rec.matchScore}%</div>
                                                <div className="text-[10px] font-bold uppercase text-neutral-400 tracking-tighter">AI Match Score</div>
                                            </div>
                                        </div>

                                        <h3 className="text-lg font-bold mb-2 line-clamp-1">{rec.suggestion}</h3>
                                        <div className="text-xs font-bold text-amber-600 dark:text-amber-500 mb-3">{rec.priceRange}</div>
                                        <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-6 flex-1">{rec.reasoning}</p>

                                        <Link
                                            href={`/properties?search=${encodeURIComponent(rec.suggestion)}`}
                                            className="w-full text-center py-2 rounded-xl border border-neutral-200 dark:border-neutral-700 text-sm font-bold hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors"
                                        >
                                            View listings
                                        </Link>
                                    </motion.div>
                                ))}
                            </div>
                        </motion.div>
                    )}

                    {!loading && recommendations.length === 0 && !error && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="bg-neutral-100/50 dark:bg-neutral-900/50 border-2 border-dashed border-neutral-200 dark:border-neutral-800 rounded-3xl p-12 text-center"
                        >
                            <Sparkles className="w-12 h-12 text-neutral-300 mx-auto mb-4" />
                            <h3 className="text-xl font-bold mb-2">Ready to find your dream property?</h3>
                            <p className="text-neutral-500 max-w-sm mx-auto">Enter your niche requirements above and let our AI scout the best options for you.</p>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </section>
    );
}
