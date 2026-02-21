"use client";

import { useState } from "react";
import { Sparkles, TrendingUp, Info, Shield, School, Map, ShoppingBag, Utensils, TreePine, AlertCircle, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface NeighborhoodData {
    overview: string;
    ratings: {
        safety: number; schools: number; transportation: number; shopping: number; dining: number; parks: number; overall: number;
    };
    highlights: string[];
    considerations: string[];
    averagePrice: string;
}

interface PricePredictionData {
    estimatedPrice: number;
    priceRange: { low: number; high: number };
    confidence: number;
    marketInsight: string;
    factors: { factor: string; impact: string }[];
}

export function AIPropertyInsights({ property }: { property: any }) {
    const [activeTab, setActiveTab] = useState<"neighborhood" | "price">("neighborhood");
    const [neighborhoodData, setNeighborhoodData] = useState<NeighborhoodData | null>(null);
    const [priceData, setPriceData] = useState<PricePredictionData | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchNeighborhoodAnalysis = async () => {
        setLoading(true);
        setError(null);
        try {
            const res = await fetch("/api/ai/neighborhood", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    location: property.location,
                    propertyType: property.type
                }),
            });
            const data = await res.json();
            if (data.error) throw new Error(data.error);
            setNeighborhoodData(data);
        } catch (err: any) {
            setError(err.message || "Failed to analyze neighborhood");
        } finally {
            setLoading(false);
        }
    };

    const fetchPricePrediction = async () => {
        setLoading(true);
        setError(null);
        try {
            const res = await fetch("/api/ai/price-predict", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    location: property.location,
                    propertyType: property.type,
                    bedrooms: property.bedrooms,
                    bathrooms: property.bathrooms,
                    areaSqft: property.areaSqft,
                    amenities: property.amenities,
                    listingType: property.listingType
                }),
            });
            const data = await res.json();
            if (data.error) throw new Error(data.error);
            setPriceData(data);
        } catch (err: any) {
            setError(err.message || "Failed to predict price");
        } finally {
            setLoading(false);
        }
    };

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            maximumFractionDigits: 0
        }).format(price);
    };

    const getRatingColor = (rating: number) => {
        if (rating >= 8) return "text-emerald-500";
        if (rating >= 6) return "text-blue-500";
        if (rating >= 4) return "text-amber-500";
        return "text-red-500";
    };

    return (
        <div className="p-6 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-sm overflow-hidden">
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                    <div className="p-2 rounded-lg bg-blue-500 text-white">
                        <Sparkles className="w-5 h-5" />
                    </div>
                    <h2 className="text-xl font-bold">AI Property Insights</h2>
                </div>
                <div className="flex bg-neutral-100 dark:bg-neutral-800 p-1 rounded-xl">
                    <button
                        onClick={() => setActiveTab("neighborhood")}
                        className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all ${activeTab === "neighborhood"
                                ? "bg-white dark:bg-neutral-700 shadow-sm text-blue-600 dark:text-blue-400"
                                : "text-neutral-500"
                            }`}
                    >
                        Neighborhood
                    </button>
                    <button
                        onClick={() => setActiveTab("price")}
                        className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all ${activeTab === "price"
                                ? "bg-white dark:bg-neutral-700 shadow-sm text-blue-600 dark:text-blue-400"
                                : "text-neutral-500"
                            }`}
                    >
                        Price Forecast
                    </button>
                </div>
            </div>

            <AnimatePresence mode="wait">
                {activeTab === "neighborhood" ? (
                    <motion.div
                        key="neighborhood"
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 10 }}
                        className="space-y-6"
                    >
                        {!neighborhoodData && !loading && (
                            <div className="text-center py-8">
                                <Map className="w-12 h-12 text-neutral-300 mx-auto mb-3" />
                                <p className="text-neutral-600 dark:text-neutral-400 mb-4">Analyze the neighborhood amenities, safety, and price trends.</p>
                                <button
                                    onClick={fetchNeighborhoodAnalysis}
                                    className="px-6 py-2.5 rounded-xl bg-blue-600 text-white font-medium hover:bg-blue-700 transition-colors shadow-lg shadow-blue-500/25"
                                >
                                    Start Analysis
                                </button>
                            </div>
                        )}

                        {loading && (
                            <div className="flex flex-col items-center justify-center py-12">
                                <Loader2 className="w-8 h-8 text-blue-500 animate-spin mb-3" />
                                <p className="text-sm font-medium animate-pulse">Consulting AI Neighborhood Experts...</p>
                            </div>
                        )}

                        {error && (
                            <div className="flex items-center gap-2 p-4 rounded-xl bg-red-50 dark:bg-red-950/20 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-800/30">
                                <AlertCircle className="w-5 h-5 flex-shrink-0" />
                                <p className="text-sm">{error}</p>
                            </div>
                        )}

                        {neighborhoodData && (
                            <div className="grid gap-6">
                                <div className="p-4 rounded-xl bg-blue-50 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-800/30">
                                    <p className="text-sm text-blue-900 dark:text-blue-100 leading-relaxed italic">
                                        "{neighborhoodData.overview}"
                                    </p>
                                </div>

                                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                                    {[
                                        { icon: Shield, label: "Safety", value: neighborhoodData.ratings.safety },
                                        { icon: School, label: "Schools", value: neighborhoodData.ratings.schools },
                                        { icon: Utensils, label: "Dining", value: neighborhoodData.ratings.dining },
                                        { icon: TreePine, label: "Parks", value: neighborhoodData.ratings.parks },
                                    ].map(({ icon: Icon, label, value }) => (
                                        <div key={label} className="text-center">
                                            <div className="flex items-center justify-center mb-1">
                                                <Icon className="w-4 h-4 text-neutral-400" />
                                            </div>
                                            <div className={`text-xl font-bold ${getRatingColor(value)}`}>{value}/10</div>
                                            <div className="text-[10px] uppercase font-bold text-neutral-500">{label}</div>
                                        </div>
                                    ))}
                                </div>

                                <div className="grid md:grid-cols-2 gap-6">
                                    <div>
                                        <h4 className="text-sm font-bold uppercase text-neutral-400 mb-3 flex items-center gap-2">
                                            <Sparkles className="w-3 h-3" /> Why people like it
                                        </h4>
                                        <ul className="space-y-2">
                                            {neighborhoodData.highlights.map((h, i) => (
                                                <li key={i} className="flex gap-2 text-sm">
                                                    <span className="text-emerald-500">✓</span>
                                                    <span>{h}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                    <div>
                                        <h4 className="text-sm font-bold uppercase text-neutral-400 mb-3 flex items-center gap-2">
                                            <Info className="w-3 h-3" /> Things to note
                                        </h4>
                                        <ul className="space-y-2">
                                            {neighborhoodData.considerations.map((c, i) => (
                                                <li key={i} className="flex gap-2 text-sm">
                                                    <span className="text-amber-500">•</span>
                                                    <span>{c}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        )}
                    </motion.div>
                ) : (
                    <motion.div
                        key="price"
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 10 }}
                        className="space-y-6"
                    >
                        {!priceData && !loading && (
                            <div className="text-center py-8">
                                <TrendingUp className="w-12 h-12 text-neutral-300 mx-auto mb-3" />
                                <p className="text-neutral-600 dark:text-neutral-400 mb-4">Predict the market value based on area trends and property specs.</p>
                                <button
                                    onClick={fetchPricePrediction}
                                    className="px-6 py-2.5 rounded-xl bg-blue-600 text-white font-medium hover:bg-blue-700 transition-colors shadow-lg shadow-blue-500/25"
                                >
                                    Predict Price
                                </button>
                            </div>
                        )}

                        {loading && (
                            <div className="flex flex-col items-center justify-center py-12">
                                <Loader2 className="w-8 h-8 text-blue-500 animate-spin mb-3" />
                                <p className="text-sm font-medium animate-pulse">Neural Market Analysis in progress...</p>
                            </div>
                        )}

                        {error && (
                            <div className="flex items-center gap-2 p-4 rounded-xl bg-red-50 dark:bg-red-950/20 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-800/30">
                                <AlertCircle className="w-5 h-5 flex-shrink-0" />
                                <p className="text-sm">{error}</p>
                            </div>
                        )}

                        {priceData && (
                            <div className="grid gap-6">
                                <div className="grid sm:grid-cols-2 gap-4">
                                    <div className="p-4 rounded-xl bg-gradient-to-br from-blue-600 to-blue-700 text-white shadow-lg">
                                        <div className="text-xs font-bold uppercase opacity-80 mb-1">Estimated Value</div>
                                        <div className="text-2xl font-bold">{formatPrice(priceData.estimatedPrice)}</div>
                                        <div className="text-xs mt-2 bg-white/20 px-2 py-0.5 rounded inline-block">
                                            {priceData.confidence}% Confidence
                                        </div>
                                    </div>
                                    <div className="p-4 rounded-xl bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700">
                                        <div className="text-xs font-bold uppercase text-neutral-500 mb-1">Expected Range</div>
                                        <div className="text-lg font-bold">
                                            {formatPrice(priceData.priceRange.low)} - {formatPrice(priceData.priceRange.high)}
                                        </div>
                                        <p className="text-[10px] text-neutral-500 mt-2">Based on current market volatility and nearby sales.</p>
                                    </div>
                                </div>

                                <div className="p-4 rounded-xl bg-amber-50 dark:bg-amber-950/10 border border-amber-100 dark:border-amber-800/30">
                                    <h4 className="text-xs font-bold uppercase text-amber-700 dark:text-amber-400 mb-2 flex items-center gap-1">
                                        <Sparkles className="w-3 h-3" /> Market Insight
                                    </h4>
                                    <p className="text-sm text-neutral-700 dark:text-neutral-300 italic leading-relaxed">
                                        "{priceData.marketInsight}"
                                    </p>
                                </div>

                                <div>
                                    <h4 className="text-sm font-bold uppercase text-neutral-400 mb-3">Key Price Drivers</h4>
                                    <div className="grid gap-2">
                                        {priceData.factors.map((f, i) => (
                                            <div key={i} className="flex items-center justify-between p-2 rounded-lg bg-neutral-50 dark:bg-neutral-800/50 border border-neutral-200 dark:border-neutral-800">
                                                <span className="text-sm font-medium">{f.factor}</span>
                                                <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-full ${f.impact.toLowerCase().includes('positive') || f.impact.toLowerCase().includes('high')
                                                        ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600'
                                                        : 'bg-neutral-200 dark:bg-neutral-700 text-neutral-500'
                                                    }`}>
                                                    {f.impact}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
