"use client";

import { useEffect, useState } from "react";
import { PropertyCard } from "@/components/property-card";
import { SkeletonCard } from "@/components/skeleton-card";
import { Property } from "@/types";
import { Heart } from "lucide-react";
import { toast } from "sonner";

export default function FavoritesPage() {
    const [properties, setProperties] = useState<Property[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchFavorites = async () => {
            try {
                const res = await fetch("/api/favorites");
                const data = await res.json();
                if (data.success) setProperties(data.data);
            } catch {
                toast.error("Failed to load favorites");
            } finally {
                setLoading(false);
            }
        };
        fetchFavorites();
    }, []);

    const handleRemoveFavorite = async (propertyId: number) => {
        try {
            await fetch(`/api/favorites?propertyId=${propertyId}`, { method: "DELETE" });
            setProperties(properties.filter((p) => p.id !== propertyId));
            toast.success("Removed from favorites");
        } catch {
            toast.error("Failed to remove from favorites");
        }
    };

    return (
        <div className="max-w-6xl mx-auto px-4 py-8">
            <h1 className="text-2xl font-bold mb-6 flex items-center gap-2">
                <Heart className="w-6 h-6 text-red-500" />
                My Favorites
            </h1>

            {loading ? (
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
                    {Array.from({ length: 3 }).map((_, i) => <SkeletonCard key={i} />)}
                </div>
            ) : properties.length === 0 ? (
                <div className="text-center py-20">
                    <Heart className="w-12 h-12 text-neutral-300 dark:text-neutral-600 mx-auto mb-4" />
                    <p className="text-neutral-500 font-medium">No favorites yet</p>
                    <p className="text-sm text-neutral-400 mt-1">Start browsing and save properties you love</p>
                </div>
            ) : (
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
                    {properties.map((property) => (
                        <PropertyCard
                            key={property.id}
                            property={property}
                            onFavorite={handleRemoveFavorite}
                            isFavorited
                        />
                    ))}
                </div>
            )}
        </div>
    );
}
