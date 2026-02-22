"use client";

import { useState } from "react";
import { Sparkles, X, TrendingUp, Shield, School, Map, ShoppingBag, Utensils, TreePine, AlertCircle, Loader2, ArrowUpRight, CheckCircle2, Info } from "lucide-react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { cn } from "@/lib/utils";

interface AIInsightPanelProps {
    property: any;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export function AIInsightPanel({ property, open, onOpenChange }: AIInsightPanelProps) {
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState<any>(null);

    const fetchData = async () => {
        setLoading(true);
        try {
            // Combine neighborhood and price prediction for a "Full Insight"
            const [neighborhoodRes, priceRes] = await Promise.all([
                fetch("/api/ai/neighborhood", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ location: property.location, propertyType: property.type }),
                }),
                fetch("/api/ai/price-predict", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        location: property.location,
                        propertyType: property.type,
                        bedrooms: property.bedrooms,
                        bathrooms: property.bathrooms,
                        areaSqft: property.areaSqft,
                        amenities: property.amenities,
                    }),
                })
            ]);

            const neighborhood = await neighborhoodRes.json();
            const price = await priceRes.json();

            setData({ neighborhood, price });
        } catch (error) {
            console.error(error);
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

    return (
        <DialogPrimitive.Root open={open} onOpenChange={(o) => {
            onOpenChange(o);
            if (o && !data) fetchData();
        }}>
            {open && (
                <DialogPrimitive.Portal forceMount>
                    <DialogPrimitive.Overlay
                        className="fixed inset-0 z-50 bg-black/60 backdrop-blur-md"
                    />

                    <DialogPrimitive.Content
                        className="fixed right-0 top-0 z-50 h-screen w-full max-w-2xl bg-white dark:bg-neutral-950 shadow-2xl overflow-y-auto flex flex-col"
                    >
                        {/* Header */}
                        <div className="sticky top-0 z-10 flex items-center justify-between p-6 bg-white/80 dark:bg-neutral-950/80 backdrop-blur-xl border-b border-neutral-100 dark:border-neutral-900">
                            <div className="flex items-center gap-3">
                                <div className="p-2.5 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/20">
                                    <Sparkles className="w-5 h-5" />
                                </div>
                                <div>
                                    <DialogPrimitive.Title className="text-xl font-black">AI Property Insight</DialogPrimitive.Title>
                                    <DialogPrimitive.Description className="text-xs text-neutral-500 font-bold uppercase tracking-widest leading-none mt-1">
                                        {property.title}
                                    </DialogPrimitive.Description>
                                </div>
                            </div>
                            <DialogPrimitive.Close className="p-2 rounded-xl hover:bg-neutral-100 dark:hover:bg-neutral-900 transition-colors">
                                <X className="w-5 h-5" />
                            </DialogPrimitive.Close>
                        </div>

                        <div className="flex-1 p-6 space-y-8">
                            {loading ? (
                                <div className="flex flex-col items-center justify-center py-20 italic text-neutral-400">
                                    <Loader2 className="w-12 h-12 animate-spin mb-4 text-blue-600" />
                                    <p className="animate-pulse">Synthesizing real-time market data...</p>
                                </div>
                            ) : data ? (
                                <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                                    {/* Investment Potential */}
                                    <section className="mb-10">
                                        <div className="flex items-center gap-2 mb-4">
                                            <TrendingUp className="w-4 h-4 text-blue-600" />
                                            <h3 className="text-sm font-black uppercase tracking-widest text-neutral-400">Investment Snapshot</h3>
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="p-6 rounded-[2rem] bg-neutral-50 dark:bg-neutral-900 border border-neutral-100 dark:border-neutral-800">
                                                <div className="text-[10px] font-bold text-neutral-400 uppercase mb-1">Expected ROI</div>
                                                <div className="text-3xl font-black text-emerald-500">8.4%</div>
                                                <div className="text-[10px] text-neutral-400 mt-1 uppercase font-bold">Annual appreciation</div>
                                            </div>
                                            <div className="p-6 rounded-[2rem] bg-neutral-50 dark:bg-neutral-900 border border-neutral-100 dark:border-neutral-800">
                                                <div className="text-[10px] font-bold text-neutral-400 uppercase mb-1">AI Match Score</div>
                                                <div className="text-3xl font-black text-blue-600">94/100</div>
                                                <div className="text-[10px] text-neutral-400 mt-1 uppercase font-bold">High potential</div>
                                            </div>
                                        </div>
                                    </section>

                                    {/* Price Analysis */}
                                    <section className="mb-10">
                                        <div className="flex items-center gap-2 mb-4">
                                            <Info className="w-4 h-4 text-blue-600" />
                                            <h3 className="text-sm font-black uppercase tracking-widest text-neutral-400">Price Prediction</h3>
                                        </div>
                                        <div className="p-8 rounded-[2.5rem] bg-gradient-to-br from-blue-600 to-indigo-700 text-white shadow-2xl shadow-blue-500/20">
                                            <div className="text-xs font-bold uppercase opacity-60 mb-1">AI Estimated Market Value</div>
                                            <div className="text-4xl font-black mb-4">{formatPrice(data.price.estimatedPrice)}</div>
                                            <div className="p-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/10 italic text-sm text-blue-50 leading-relaxed">
                                                "{data.price.marketInsight}"
                                            </div>
                                        </div>
                                    </section>

                                    {/* Neighborhood Scorecard */}
                                    <section>
                                        <div className="flex items-center gap-2 mb-4">
                                            <Map className="w-4 h-4 text-blue-600" />
                                            <h3 className="text-sm font-black uppercase tracking-widest text-neutral-400">Neighborhood Scorecard</h3>
                                        </div>
                                        <div className="grid grid-cols-2 gap-4 mb-6">
                                            {Object.entries(data.neighborhood.ratings).filter(([k]) => k !== 'overall').map(([key, value]: any) => (
                                                <div key={key} className="flex items-center justify-between p-4 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-100 dark:border-neutral-800">
                                                    <span className="text-xs font-bold capitalize text-neutral-500">{key}</span>
                                                    <span className="text-lg font-black text-blue-600">{value}/10</span>
                                                </div>
                                            ))}
                                        </div>
                                        <div className="space-y-4">
                                            <div className="p-5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-900/40">
                                                <h4 className="text-[10px] font-black uppercase text-emerald-600 mb-2">Key Advantages</h4>
                                                <ul className="space-y-1.5">
                                                    {data.neighborhood.highlights.map((h: string, i: number) => (
                                                        <li key={i} className="flex items-center gap-2 text-sm text-emerald-900 dark:text-emerald-100">
                                                            <CheckCircle2 className="w-3.5 h-3.5" />
                                                            {h}
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                        </div>
                                    </section>
                                </div>
                            ) : null}
                        </div>

                        {/* Footer Action */}
                        <div className="p-6 border-t border-neutral-100 dark:border-neutral-900">
                            <button className="w-full flex items-center justify-center gap-2 py-4 rounded-2xl bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 font-black transition-all hover:scale-[1.02] active:scale-[0.98] shadow-xl">
                                Download AI Report
                                <ArrowUpRight className="w-4 h-4" />
                            </button>
                        </div>
                    </DialogPrimitive.Content>
                </DialogPrimitive.Portal>
            )}
        </DialogPrimitive.Root>
    );
}
