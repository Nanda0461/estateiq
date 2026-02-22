"use client";

import * as React from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { X, SlidersHorizontal, Filter } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

interface FilterDrawerProps {
    children: React.ReactNode;
    activeCount: number;
}

export function FilterDrawer({ children, activeCount }: FilterDrawerProps) {
    const [open, setOpen] = React.useState(false);

    return (
        <DialogPrimitive.Root open={open} onOpenChange={setOpen}>
            <DialogPrimitive.Trigger asChild>
                <button className="flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-sm font-bold hover:border-blue-500 dark:hover:border-blue-500 transition-all duration-300 shadow-sm hover:shadow-blue-500/10 group">
                    <SlidersHorizontal className="w-4 h-4 group-hover:rotate-12 transition-transform" />
                    Filters
                    {activeCount > 0 && (
                        <span className="flex items-center justify-center min-w-[20px] h-5 px-1.5 rounded-full bg-blue-600 text-[10px] text-white font-black animate-in zoom-in duration-300">
                            {activeCount}
                        </span>
                    )}
                </button>
            </DialogPrimitive.Trigger>

            <AnimatePresence>
                {open && (
                    <DialogPrimitive.Portal forceMount>
                        <DialogPrimitive.Overlay asChild>
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm shadow-2xl"
                            />
                        </DialogPrimitive.Overlay>

                        <DialogPrimitive.Content asChild>
                            <motion.div
                                initial={{ x: "100%" }}
                                animate={{ x: 0 }}
                                exit={{ x: "100%" }}
                                transition={{ type: "spring", damping: 25, stiffness: 200 }}
                                className="fixed right-0 top-0 z-50 h-screen w-full max-w-md bg-white dark:bg-neutral-950 shadow-[-20px_0_50px_rgba(0,0,0,0.1)] border-l border-neutral-200 dark:border-neutral-800 flex flex-col"
                            >
                                {/* Header */}
                                <div className="flex items-center justify-between p-6 border-b border-neutral-100 dark:border-neutral-900">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2.5 rounded-xl bg-blue-500/10 text-blue-600">
                                            <Filter className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <DialogPrimitive.Title className="text-lg font-bold">Filters</DialogPrimitive.Title>
                                            <DialogPrimitive.Description className="text-xs text-neutral-500">Refine your property search</DialogPrimitive.Description>
                                        </div>
                                    </div>
                                    <DialogPrimitive.Close className="p-2 rounded-xl hover:bg-neutral-100 dark:hover:bg-neutral-900 transition-colors">
                                        <X className="w-5 h-5" />
                                    </DialogPrimitive.Close>
                                </div>

                                {/* Content */}
                                <div className="flex-1 overflow-y-auto p-6 space-y-8 custom-scrollbar">
                                    {children}
                                </div>

                                {/* Footer */}
                                <div className="p-6 border-t border-neutral-100 dark:border-neutral-900 bg-neutral-50/50 dark:bg-neutral-900/50 backdrop-blur-md">
                                    <button
                                        onClick={() => setOpen(false)}
                                        className="w-full py-4 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-bold transition-all shadow-lg shadow-blue-500/20 active:scale-[0.98]"
                                    >
                                        Show Results
                                    </button>
                                </div>
                            </motion.div>
                        </DialogPrimitive.Content>
                    </DialogPrimitive.Portal>
                )}
            </AnimatePresence>
        </DialogPrimitive.Root>
    );
}
