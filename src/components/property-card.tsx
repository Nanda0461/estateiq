"use client";

import Link from "next/link";
import { MapPin, Bed, Bath, Maximize, Heart, Eye } from "lucide-react";
import { Property } from "@/types";

interface PropertyCardProps {
    property: Property;
    onFavorite?: (id: number) => void;
    isFavorited?: boolean;
}

export function PropertyCard({ property, onFavorite, isFavorited }: PropertyCardProps) {
    const images = (property.images as string[]) || [];
    const firstImage = images[0] || "https://placehold.co/400x300/e2e8f0/94a3b8?text=No+Image";

    const formatPrice = (price: number) => {
        if (price >= 10000000) return `₹${(price / 10000000).toFixed(1)}Cr`;
        if (price >= 100000) return `₹${(price / 100000).toFixed(1)}L`;
        return `₹${price.toLocaleString()}`;
    };

    return (
        <div className="group rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 overflow-hidden shadow-sm hover:shadow-xl hover:shadow-blue-500/5 transition-all duration-300 hover:-translate-y-1">
            {/* Image */}
            <div className="relative h-52 overflow-hidden">
                <img
                    src={firstImage}
                    alt={property.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />

                {/* Badges */}
                <div className="absolute top-3 left-3 flex gap-2">
                    <span className={`px-2.5 py-1 rounded-lg text-xs font-semibold ${property.listingType === "FOR_SALE"
                            ? "bg-emerald-500/90 text-white"
                            : "bg-amber-500/90 text-white"
                        }`}>
                        {property.listingType === "FOR_SALE" ? "For Sale" : "For Rent"}
                    </span>
                    <span className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-white/90 dark:bg-neutral-800/90 text-neutral-700 dark:text-neutral-300 capitalize">
                        {property.type.toLowerCase()}
                    </span>
                </div>

                {/* Favorite button */}
                {onFavorite && (
                    <button
                        onClick={(e) => {
                            e.preventDefault();
                            onFavorite(property.id);
                        }}
                        className="absolute top-3 right-3 p-2 rounded-full bg-white/90 dark:bg-neutral-800/90 hover:bg-white dark:hover:bg-neutral-800 transition-colors"
                    >
                        <Heart
                            className={`w-4 h-4 ${isFavorited ? "fill-red-500 text-red-500" : "text-neutral-500"
                                }`}
                        />
                    </button>
                )}

                {/* Price */}
                <div className="absolute bottom-3 left-3">
                    <span className="px-3 py-1.5 rounded-lg bg-black/70 text-white text-sm font-bold backdrop-blur-sm">
                        {formatPrice(property.price)}
                        {property.listingType === "FOR_RENT" && (
                            <span className="text-xs font-normal opacity-80">/mo</span>
                        )}
                    </span>
                </div>
            </div>

            {/* Content */}
            <Link href={`/properties/${property.id}`} className="block p-4">
                <h3 className="font-semibold text-base mb-1 truncate group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                    {property.title}
                </h3>

                <div className="flex items-center gap-1 text-sm text-neutral-500 dark:text-neutral-400 mb-3">
                    <MapPin className="w-3.5 h-3.5 flex-shrink-0" />
                    <span className="truncate">{property.location}</span>
                </div>

                <div className="flex items-center gap-4 text-sm text-neutral-600 dark:text-neutral-400">
                    <div className="flex items-center gap-1">
                        <Bed className="w-3.5 h-3.5" />
                        <span>{property.bedrooms} Beds</span>
                    </div>
                    <div className="flex items-center gap-1">
                        <Bath className="w-3.5 h-3.5" />
                        <span>{property.bathrooms} Baths</span>
                    </div>
                    <div className="flex items-center gap-1">
                        <Maximize className="w-3.5 h-3.5" />
                        <span>{property.areaSqft} sqft</span>
                    </div>
                </div>

                <div className="flex items-center gap-2 mt-3 pt-3 border-t border-neutral-100 dark:border-neutral-800 text-xs text-neutral-400">
                    <Eye className="w-3 h-3" />
                    <span>{property.viewsCount} views</span>
                </div>
            </Link>
        </div>
    );
}
