"use client";

import { useEffect, useState, useCallback, Suspense, useMemo } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { PropertyCard } from "@/components/property-card";
import { SkeletonCard } from "@/components/skeleton-card";
import { Property } from "@/types";
import {
    SlidersHorizontal,
    Building2,
    MapPin,
    ChevronLeft,
    ChevronRight,
    Sparkles
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { AISmartSuggestions } from "@/components/ai-smart-suggestions";

function PropertiesContent() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const pathname = usePathname();
    const [showMobileFilters, setShowMobileFilters] = useState(false);

    const [properties, setProperties] = useState<Property[]>([]);
    const [loading, setLoading] = useState(true);
    const [total, setTotal] = useState(0);
    const limit = 12;

    // Derived filters from URL - Single Source of Truth
    const filters = useMemo(() => ({
        search: searchParams.get("search") || "",
        type: searchParams.get("type") || "",
        listingType: searchParams.get("listingType") || "",
        minPrice: searchParams.get("minPrice") || "",
        maxPrice: searchParams.get("maxPrice") || "",
        bedrooms: searchParams.get("bedrooms") || "",
        location: searchParams.get("location") || "",
        sortBy: searchParams.get("sortBy") || "createdAt",
        sortOrder: searchParams.get("sortOrder") || "desc",
        page: Number(searchParams.get("page")) || 1,
    }), [searchParams]);

    const activeFilterCount = useMemo(() => {
        let count = 0;
        const keys = ["search", "type", "listingType", "bedrooms", "location"];
        keys.forEach(key => { if (searchParams.get(key)) count++; });
        if (searchParams.get("minPrice") || searchParams.get("maxPrice")) count++;
        return count;
    }, [searchParams]);

    const updateFilters = useCallback((updates: Partial<typeof filters>) => {
        const params = new URLSearchParams(searchParams.toString());
        Object.entries(updates).forEach(([key, value]) => {
            if (value) params.set(key, String(value));
            else params.delete(key);
        });
        if (!("page" in updates)) params.set("page", "1");
        router.replace(`${pathname}?${params.toString()}`, { scroll: false });
    }, [pathname, router, searchParams]);

    const fetchProperties = useCallback(async () => {
        setLoading(true);
        try {
            const res = await fetch(`/api/properties?${searchParams.toString()}&limit=${limit}`);
            const data = await res.json();
            if (data.success) {
                setProperties(data.data.results);
                setTotal(data.data.total);
            }
        } catch (error) {
            console.error("Fetch error:", error);
            toast.error("Failed to load properties");
        } finally {
            setLoading(false);
        }
    }, [searchParams]);

    useEffect(() => {
        fetchProperties();
    }, [fetchProperties]);



    const handleClearFilters = () => {
        router.replace(pathname, { scroll: false });
    };

    const totalPages = Math.ceil(total / limit);

    return (
        <div className="max-w-7xl mx-auto px-4 py-8">
            <div className="flex flex-col md:flex-row gap-8">
                {/* Mobile Filter Toggle */}
                <button
                    onClick={() => setShowMobileFilters(!showMobileFilters)}
                    className="md:hidden flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-sm font-bold transition-all"
                >
                    <SlidersHorizontal className="w-4 h-4" />
                    {showMobileFilters ? "Hide Filters" : "Show Filters"}
                    {activeFilterCount > 0 && (
                        <span className="flex items-center justify-center min-w-[20px] h-5 px-1.5 rounded-full bg-blue-600 text-[10px] text-white font-black">
                            {activeFilterCount}
                        </span>
                    )}
                </button>

                {/* Sidebar - Simple Filters */}
                <aside className={`w-full md:w-64 space-y-6 ${showMobileFilters ? 'block' : 'hidden md:block'}`}>
                    <div className="flex items-center justify-between">
                        <h2 className="text-xl font-bold flex items-center gap-2">
                            <SlidersHorizontal className="w-5 h-5" />
                            Filters
                        </h2>
                        {activeFilterCount > 0 && (
                            <button onClick={handleClearFilters} className="text-xs text-red-500 font-medium hover:underline">
                                Clear
                            </button>
                        )}
                    </div>

                    <div className="space-y-4">
                        <div>
                            <label className="block text-xs font-bold uppercase text-neutral-400 mb-1">Search</label>
                            <input
                                type="text"
                                placeholder="Locality, features..."
                                value={filters.search}
                                onChange={(e) => updateFilters({ search: e.target.value })}
                                className="w-full p-2.5 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 text-sm"
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-bold uppercase text-neutral-400 mb-1">Type</label>
                            <select
                                value={filters.listingType}
                                onChange={(e) => updateFilters({ listingType: e.target.value })}
                                className="w-full p-2.5 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 text-sm"
                            >
                                <option value="">All Types</option>
                                <option value="FOR_SALE">Buying</option>
                                <option value="FOR_RENT">Rent</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-xs font-bold uppercase text-neutral-400 mb-1">Category</label>
                            <select
                                value={filters.type}
                                onChange={(e) => updateFilters({ type: e.target.value })}
                                className="w-full p-2.5 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 text-sm"
                            >
                                <option value="">Any Category</option>
                                <option value="APARTMENT">Apartment</option>
                                <option value="HOUSE">House</option>
                                <option value="VILLA">Villa</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-xs font-bold uppercase text-neutral-400 mb-1">Max Price</label>
                            <input
                                type="number"
                                placeholder="Max Budget"
                                value={filters.maxPrice}
                                onChange={(e) => updateFilters({ maxPrice: e.target.value })}
                                className="w-full p-2.5 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 text-sm"
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-bold uppercase text-neutral-400 mb-1">Beds</label>
                            <select
                                value={filters.bedrooms}
                                onChange={(e) => updateFilters({ bedrooms: e.target.value })}
                                className="w-full p-2.5 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 text-sm"
                            >
                                <option value="">Any</option>
                                <option value="1">1 BHK</option>
                                <option value="2">2 BHK</option>
                                <option value="3">3 BHK</option>
                                <option value="4">4+ BHK</option>
                            </select>
                        </div>
                    </div>
                </aside>

                <main className="flex-1 space-y-8">
                    {/* AI Recommender (AI Smart Suggestions) */}
                    <section className="bg-blue-600 rounded-2xl p-6 text-white shadow-xl overflow-hidden">
                        <div className="flex items-center gap-2 mb-4">
                            <Sparkles className="w-5 h-5" />
                            <h2 className="text-lg font-bold">AI Property Recommender</h2>
                        </div>
                        <AISmartSuggestions
                            onApplyFilters={(f: any) => updateFilters(f)}
                            isLoading={loading}
                        />
                    </section>

                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-2">
                        <h2 className="text-xl sm:text-2xl font-bold">
                            {loading ? "Searching..." : `${total} Properties found`}
                        </h2>
                        <select
                            value={`${filters.sortBy}_${filters.sortOrder}`}
                            onChange={(e) => {
                                const [sortBy, sortOrder] = e.target.value.split("_");
                                updateFilters({ sortBy, sortOrder });
                            }}
                            className="p-2.5 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 text-sm outline-none"
                        >
                            <option value="createdAt_desc">Latest</option>
                            <option value="price_asc">Price: Low-High</option>
                            <option value="price_desc">Price: High-Low</option>
                        </select>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                        {loading ? (
                            Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)
                        ) : properties.length === 0 ? (
                            <div className="col-span-full py-20 text-center border-2 border-dashed border-neutral-200 dark:border-neutral-800 rounded-3xl">
                                <Building2 className="w-12 h-12 text-neutral-200 mx-auto mb-4" />
                                <h3 className="text-xl font-bold mb-1">No properties found</h3>
                                <p className="text-neutral-500">Try adjusting your filters.</p>
                            </div>
                        ) : (
                            properties.map(property => (
                                <PropertyCard
                                    key={property.id}
                                    property={property}
                                    showCompare={false}
                                />
                            ))
                        )}
                    </div>

                    {/* Simple Pagination */}
                    {!loading && totalPages > 1 && (
                        <div className="flex items-center justify-center gap-4 pt-10 border-t border-neutral-100 dark:border-neutral-900">
                            <button
                                onClick={() => updateFilters({ page: Math.max(1, filters.page - 1) })}
                                disabled={filters.page === 1}
                                className="p-2.5 rounded-lg border border-neutral-200 dark:border-neutral-800 disabled:opacity-20 hover:bg-neutral-50"
                            >
                                <ChevronLeft className="w-5 h-5" />
                            </button>
                            <span className="text-sm font-bold">Page {filters.page} of {totalPages}</span>
                            <button
                                onClick={() => updateFilters({ page: Math.min(totalPages, filters.page + 1) })}
                                disabled={filters.page === totalPages}
                                className="p-2.5 rounded-lg border border-neutral-200 dark:border-neutral-800 disabled:opacity-20 hover:bg-neutral-50"
                            >
                                <ChevronRight className="w-5 h-5" />
                            </button>
                        </div>
                    )}
                </main>
            </div>
        </div>
    );
}

export default function PropertiesPage() {
    return (
        <Suspense fallback={<div className="p-10 text-center">Loading Properties...</div>}>
            <PropertiesContent />
        </Suspense>
    );
}
