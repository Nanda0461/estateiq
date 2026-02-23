"use client";

import { useState } from "react";
import Link from "next/link";
import { MapPin, Bed, Bath, Maximize, Heart, Eye, Sparkles, CheckCircle2 } from "lucide-react";
import { Property } from "@/types";
import { AIInsightPanel } from "./ai-insight-panel";
import { cn } from "@/lib/utils";

interface PropertyCardProps {
    property: Property;
    onFavorite?: (id: number) => void;
    isFavorited?: boolean;
    isSelected?: boolean;
    onSelect?: (property: Property) => void;
    showCompare?: boolean;
}

export function PropertyCard({
    property,
    onFavorite,
    isFavorited,
    isSelected,
    onSelect,
    showCompare
}: PropertyCardProps) {
    const [showInsights, setShowInsights] = useState(false);
    const images = (property.images as string[]) || [];
    const firstImage = images[0] || "https://placehold.co/400x300/e2e8f0/94a3b8?text=No+Image";

    const formatPrice = (price: number) => {
        if (price >= 10000000) return `₹${(price / 10000000).toFixed(1)}Cr`;
        if (price >= 100000) return `₹${(price / 100000).toFixed(1)}L`;
        return `₹${price.toLocaleString()}`;
    };

    return (
        <div
            className={cn(
                "group relative rounded-2xl sm:rounded-[2.5rem] bg-white dark:bg-neutral-900 border overflow-hidden transition-all duration-500",
                isSelected
                    ? "border-blue-500 ring-4 ring-blue-500/10 shadow-2xl shadow-blue-500/20"
                    : "border-neutral-200 dark:border-neutral-800 shadow-sm hover:shadow-2xl hover:shadow-blue-500/5 hover:-translate-y-2"
            )}
        >
            {/* Image Section */}
            <div className="relative h-64 overflow-hidden">
                <img
                    src={firstImage}
                    alt={property.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                />

                {/* Visual Overlays */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60 group-hover:opacity-80 transition-opacity" />

                {/* Badges */}
                <div className="absolute top-4 left-4 flex flex-wrap gap-2">
                    <span className={cn(
                        "px-3 py-1.2 rounded-full text-[10px] font-black uppercase tracking-widest backdrop-blur-md shadow-lg",
                        property.listingType === "FOR_SALE"
                            ? "bg-emerald-500/80 text-white"
                            : "bg-amber-500/80 text-white"
                    )}>
                        {property.listingType === "FOR_SALE" ? "For Sale" : "For Rent"}
                    </span>
                    <span className="px-3 py-1.2 rounded-full text-[10px] font-black uppercase tracking-widest bg-white/80 dark:bg-neutral-800/80 text-neutral-800 dark:text-neutral-200 backdrop-blur-md shadow-lg">
                        {property.type}
                    </span>
                </div>

                {/* Favorite & Compare controls */}
                <div className="absolute top-4 right-4 flex flex-col gap-2">
                    {onFavorite && (
                        <button
                            onClick={(e) => {
                                e.preventDefault();
                                onFavorite(property.id);
                            }}
                            className="p-2.5 rounded-2xl bg-white/90 dark:bg-neutral-900/90 hover:bg-white dark:hover:bg-neutral-900 text-neutral-600 dark:text-neutral-400 hover:text-red-500 transition-all shadow-xl active:scale-90"
                        >
                            <Heart className={cn("w-4 h-4", isFavorited && "fill-red-500 text-red-500 animate-pulse")} />
                        </button>
                    )}
                </div>

                {/* Price Display */}
                <div className="absolute bottom-4 left-4">
                    <div className="px-4 py-2 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 text-white shadow-2xl">
                        <span className="text-xl font-black italic tracking-tight">{formatPrice(property.price)}</span>
                        {property.listingType === "FOR_RENT" && (
                            <span className="text-xs font-bold opacity-60 ml-1">/mo</span>
                        )}
                    </div>
                </div>
            </div>

            {/* Content Section */}
            <div className="p-4 sm:p-6">
                <div className="flex items-center gap-2 mb-2">
                    <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-600 text-[9px] font-black uppercase tracking-tighter cursor-help" onClick={() => setShowInsights(true)}>
                        <Sparkles className="w-2.5 h-2.5" />
                        AI Recommended
                    </div>
                </div>

                <Link href={`/properties/${property.id}`} className="block">
                    <h3 className="font-black text-lg mb-1 truncate group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors tracking-tight">
                        {property.title}
                    </h3>
                </Link>

                <div className="flex items-center gap-1.5 text-xs text-neutral-400 font-medium mb-5">
                    <MapPin className="w-3.5 h-3.5 text-blue-500" />
                    <span className="truncate uppercase tracking-wider">{property.location}</span>
                </div>

                <div className="grid grid-cols-3 gap-3 mb-6">
                    <div className="flex flex-col items-center justify-center p-3 rounded-2xl bg-neutral-50 dark:bg-neutral-800/50 border border-neutral-100 dark:border-neutral-800/50">
                        <Bed className="w-4 h-4 text-blue-500 mb-1" />
                        <span className="text-[10px] font-black text-neutral-600 dark:text-neutral-400 uppercase">{property.bedrooms} Beds</span>
                    </div>
                    <div className="flex flex-col items-center justify-center p-3 rounded-2xl bg-neutral-50 dark:bg-neutral-800/50 border border-neutral-100 dark:border-neutral-800/50">
                        <Bath className="w-4 h-4 text-blue-500 mb-1" />
                        <span className="text-[10px] font-black text-neutral-600 dark:text-neutral-400 uppercase">{property.bathrooms} Baths</span>
                    </div>
                    <div className="flex flex-col items-center justify-center p-3 rounded-2xl bg-neutral-50 dark:bg-neutral-800/50 border border-neutral-100 dark:border-neutral-800/50">
                        <Maximize className="w-4 h-4 text-blue-500 mb-1" />
                        <span className="text-[10px] font-black text-neutral-600 dark:text-neutral-400 uppercase">{property.areaSqft} sqft</span>
                    </div>
                </div>

                <div className="flex items-center justify-between pt-5 border-t border-neutral-100 dark:border-neutral-800">
                    <button
                        onClick={() => setShowInsights(true)}
                        className="flex items-center gap-2 group/btn"
                    >
                        <div className="p-2 rounded-xl bg-blue-500/10 text-blue-600 group-hover/btn:bg-blue-600 group-hover/btn:text-white transition-all">
                            <Sparkles className="w-3.5 h-3.5" />
                        </div>
                        <span className="text-[10px] font-black uppercase tracking-widest text-neutral-400 group-hover/btn:text-blue-600">AI Insight</span>
                    </button>

                    <div className="flex items-center gap-1.5 text-[10px] font-bold text-neutral-400 uppercase tracking-tighter">
                        <Eye className="w-3.5 h-3.5" />
                        <span>{property.viewsCount} views</span>
                    </div>
                </div>
            </div>

            <AIInsightPanel
                property={property}
                open={showInsights}
                onOpenChange={setShowInsights}
            />
        </div>
    );
}
