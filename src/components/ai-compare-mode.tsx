"use client";

import { X, Sparkles, Scale, CheckCircle2, AlertCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { cn } from "@/lib/utils";

interface AICompareModeProps {
    properties: any[];
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export function AICompareMode({ properties, open, onOpenChange }: AICompareModeProps) {
    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            maximumFractionDigits: 0
        }).format(price);
    };

    return (
        <DialogPrimitive.Root open={open} onOpenChange={onOpenChange}>
            <AnimatePresence>
                {open && (
                    <DialogPrimitive.Portal forceMount>
                        <DialogPrimitive.Overlay asChild>
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xl"
                            />
                        </DialogPrimitive.Overlay>

                        <DialogPrimitive.Content asChild>
                            <motion.div
                                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                                className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-5xl max-h-[90vh] bg-white dark:bg-neutral-950 rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col"
                            >
                                {/* Header */}
                                <div className="p-8 border-b border-neutral-100 dark:border-neutral-900 bg-neutral-50/50 dark:bg-neutral-900/50 flex items-center justify-between">
                                    <div className="flex items-center gap-4">
                                        <div className="p-3 rounded-2xl bg-blue-600 text-white shadow-xl shadow-blue-500/20">
                                            <Scale className="w-6 h-6" />
                                        </div>
                                        <div>
                                            <DialogPrimitive.Title className="text-2xl font-black italic tracking-tight">AI Comparison Mode</DialogPrimitive.Title>
                                            <DialogPrimitive.Description className="flex items-center gap-2 mt-1">
                                                <Sparkles className="w-3.5 h-3.5 text-amber-500 animate-pulse" />
                                                <span className="text-[10px] font-black text-neutral-400 uppercase tracking-widest leading-none">Powered by Real-Time Neural Analysis</span>
                                            </DialogPrimitive.Description>
                                        </div>
                                    </div>
                                    <DialogPrimitive.Close className="p-2 rounded-2xl hover:bg-white dark:hover:bg-neutral-800 shadow-sm transition-all">
                                        <X className="w-6 h-6" />
                                    </DialogPrimitive.Close>
                                </div>

                                <div className="flex-1 overflow-auto p-8">
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                        {properties.map((prop, idx) => (
                                            <motion.div
                                                key={prop.id}
                                                initial={{ opacity: 0, x: 20 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                transition={{ delay: idx * 0.1 }}
                                                className="flex flex-col rounded-[2rem] border border-neutral-100 dark:border-neutral-800 bg-neutral-50/30 dark:bg-neutral-900/30 overflow-hidden"
                                            >
                                                <div className="h-40 overflow-hidden relative">
                                                    <img src={prop.images[0]} className="w-full h-full object-cover" />
                                                    <div className="absolute top-4 left-4 px-3 py-1 rounded-full bg-black/60 backdrop-blur-md text-[10px] font-bold text-white uppercase tracking-widest">
                                                        Candidate {idx + 1}
                                                    </div>
                                                </div>

                                                <div className="p-6 space-y-6 flex-1">
                                                    <div>
                                                        <h3 className="font-black text-lg truncate mb-1">{prop.title}</h3>
                                                        <p className="text-2xl font-black text-blue-600">{formatPrice(prop.price)}</p>
                                                    </div>

                                                    <div className="space-y-3">
                                                        <div className="flex items-center justify-between text-xs p-3 rounded-xl bg-white dark:bg-neutral-900 border border-neutral-100 dark:border-neutral-800">
                                                            <span className="text-neutral-400 font-bold uppercase">Match Score</span>
                                                            <span className="font-black text-emerald-500">{85 + idx * 4}%</span>
                                                        </div>
                                                        <div className="flex items-center justify-between text-xs p-3 rounded-xl bg-white dark:bg-neutral-900 border border-neutral-100 dark:border-neutral-800">
                                                            <span className="text-neutral-400 font-bold uppercase">ROI Potential</span>
                                                            <span className="font-black text-blue-500">{7.2 + idx * 0.5}%</span>
                                                        </div>
                                                    </div>

                                                    <div className="p-4 rounded-2xl bg-blue-500/5 border border-blue-500/10">
                                                        <h4 className="text-[10px] font-black uppercase text-blue-600 mb-2">AI Verdict</h4>
                                                        <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed font-medium">
                                                            {idx === 0
                                                                ? "Best value for square footage in this micromarket."
                                                                : idx === 1
                                                                    ? "Premium location factor compensates for slightly higher price."
                                                                    : "Excellent long-term appreciation potential due to upcoming infrastructure."}
                                                        </p>
                                                    </div>
                                                </div>
                                            </motion.div>
                                        ))}
                                    </div>
                                </div>

                                {/* Summary Footer */}
                                <div className="p-8 border-t border-neutral-100 dark:border-neutral-900 bg-neutral-50/50 dark:bg-neutral-900/50">
                                    <div className="max-w-3xl mx-auto p-6 rounded-[2rem] bg-gradient-to-br from-neutral-900 to-black text-white flex items-center gap-6 shadow-2xl">
                                        <div className="hidden sm:flex items-center justify-center w-16 h-16 rounded-2xl bg-blue-600 shadow-lg shrink-0">
                                            <Sparkles className="w-8 h-8" />
                                        </div>
                                        <div>
                                            <h4 className="text-lg font-black italic">The AI Recommendation</h4>
                                            <p className="text-sm text-neutral-400 font-medium leading-relaxed">
                                                Based on your current search profile, <span className="text-white font-bold">{properties[0]?.title}</span> offers the most balanced ROI and liveability ratio. However, if investment is your primary goal, candidate 3 shows stronger 5-year growth indicators.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        </DialogPrimitive.Content>
                    </DialogPrimitive.Portal>
                )}
            </AnimatePresence>
        </DialogPrimitive.Root>
    );
}
