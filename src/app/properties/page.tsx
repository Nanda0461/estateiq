"use client";

import { useEffect, useState, useCallback, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { PropertyCard } from "@/components/property-card";
import { SkeletonCard } from "@/components/skeleton-card";
import { Property } from "@/types";
import {
    Search,
    SlidersHorizontal,
    X,
    Building2,
    Home,
    DollarSign,
    MapPin,
    ChevronLeft,
    ChevronRight,
} from "lucide-react";
import { toast } from "sonner";

function PropertiesContent() {
    const searchParams = useSearchParams();
    const [properties, setProperties] = useState<Property[]>([]);
    const [loading, setLoading] = useState(true);
    const [total, setTotal] = useState(0);
    const [page, setPage] = useState(1);
    const [showFilters, setShowFilters] = useState(false);
    const limit = 12;

    const [filters, setFilters] = useState({
        search: searchParams.get("search") || "",
        type: searchParams.get("type") || "",
        listingType: searchParams.get("listingType") || "",
        minPrice: "",
        maxPrice: "",
        bedrooms: "",
        location: "",
        sortBy: "createdAt",
        sortOrder: "desc",
    });

    const fetchProperties = useCallback(async () => {
        setLoading(true);
        try {
            const params = new URLSearchParams();
            params.set("page", String(page));
            params.set("limit", String(limit));
            if (filters.search) params.set("search", filters.search);
            if (filters.type) params.set("type", filters.type);
            if (filters.listingType) params.set("listingType", filters.listingType);
            if (filters.minPrice) params.set("minPrice", filters.minPrice);
            if (filters.maxPrice) params.set("maxPrice", filters.maxPrice);
            if (filters.bedrooms) params.set("bedrooms", filters.bedrooms);
            if (filters.location) params.set("location", filters.location);
            params.set("sortBy", filters.sortBy);
            params.set("sortOrder", filters.sortOrder);

            const res = await fetch(`/api/properties?${params}`);
            const data = await res.json();
            if (data.success) {
                setProperties(data.data.results);
                setTotal(data.data.total);
            }
        } catch {
            toast.error("Failed to load properties");
        } finally {
            setLoading(false);
        }
    }, [page, filters]);

    useEffect(() => {
        fetchProperties();
    }, [fetchProperties]);

    const totalPages = Math.ceil(total / limit);

    const propertyTypes = [
        { value: "", label: "All Types" },
        { value: "APARTMENT", label: "Apartment", icon: Building2 },
        { value: "HOUSE", label: "House", icon: Home },
        { value: "COMMERCIAL", label: "Commercial", icon: DollarSign },
        { value: "LAND", label: "Land", icon: MapPin },
    ];

    const handleFavorite = async (propertyId: number) => {
        try {
            await fetch("/api/favorites", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ propertyId }),
            });
            toast.success("Added to favorites!");
        } catch {
            toast.error("Please login to add favorites");
        }
    };

    return (
        <div className="max-w-7xl mx-auto px-4 py-8">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-2xl font-bold">Properties</h1>
                    <p className="text-sm text-neutral-500 dark:text-neutral-400">
                        {total} properties found
                    </p>
                </div>
                <button
                    onClick={() => setShowFilters(!showFilters)}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-sm font-medium hover:border-blue-300 dark:hover:border-blue-700 transition-colors md:hidden"
                >
                    <SlidersHorizontal className="w-4 h-4" />
                    Filters
                </button>
            </div>

            <div className="flex gap-6">
                {/* Sidebar Filters */}
                <aside className={`${showFilters ? "fixed inset-0 z-50 bg-white dark:bg-neutral-950 p-6 overflow-auto" : "hidden"} md:block md:relative md:w-64 md:flex-shrink-0`}>
                    <div className="flex items-center justify-between md:hidden mb-4">
                        <h2 className="text-lg font-semibold">Filters</h2>
                        <button onClick={() => setShowFilters(false)}>
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    <div className="space-y-5">
                        {/* Search */}
                        <div>
                            <label className="block text-sm font-medium mb-1.5">Search</label>
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
                                <input
                                    type="text"
                                    placeholder="Search..."
                                    value={filters.search}
                                    onChange={(e) => { setFilters({ ...filters, search: e.target.value }); setPage(1); }}
                                    className="w-full pl-9 pr-3 py-2 rounded-xl bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-sm outline-none focus:border-blue-500 transition-colors"
                                />
                            </div>
                        </div>

                        {/* Property Type */}
                        <div>
                            <label className="block text-sm font-medium mb-1.5">Property Type</label>
                            <div className="space-y-1">
                                {propertyTypes.map(({ value, label }) => (
                                    <button
                                        key={value}
                                        onClick={() => { setFilters({ ...filters, type: value }); setPage(1); }}
                                        className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${filters.type === value
                                            ? "bg-blue-500/10 text-blue-600 dark:text-blue-400 font-medium"
                                            : "text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800"
                                            }`}
                                    >
                                        {label}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Listing Type */}
                        <div>
                            <label className="block text-sm font-medium mb-1.5">Listing Type</label>
                            <div className="grid grid-cols-2 gap-2">
                                {[
                                    { value: "", label: "All" },
                                    { value: "FOR_SALE", label: "Buy" },
                                    { value: "FOR_RENT", label: "Rent" },
                                ].map(({ value, label }) => (
                                    <button
                                        key={value}
                                        onClick={() => { setFilters({ ...filters, listingType: value }); setPage(1); }}
                                        className={`py-2 rounded-lg text-sm font-medium border transition-colors ${filters.listingType === value
                                            ? "bg-blue-500/10 border-blue-500 text-blue-600 dark:text-blue-400"
                                            : "border-neutral-200 dark:border-neutral-700 text-neutral-600 dark:text-neutral-400"
                                            }`}
                                    >
                                        {label}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Price Range */}
                        <div>
                            <label className="block text-sm font-medium mb-1.5">Price Range</label>
                            <div className="grid grid-cols-2 gap-2">
                                <input
                                    type="number"
                                    placeholder="Min"
                                    value={filters.minPrice}
                                    onChange={(e) => { setFilters({ ...filters, minPrice: e.target.value }); setPage(1); }}
                                    className="px-3 py-2 rounded-xl bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-sm outline-none focus:border-blue-500 transition-colors"
                                />
                                <input
                                    type="number"
                                    placeholder="Max"
                                    value={filters.maxPrice}
                                    onChange={(e) => { setFilters({ ...filters, maxPrice: e.target.value }); setPage(1); }}
                                    className="px-3 py-2 rounded-xl bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-sm outline-none focus:border-blue-500 transition-colors"
                                />
                            </div>
                        </div>

                        {/* Bedrooms */}
                        <div>
                            <label className="block text-sm font-medium mb-1.5">Bedrooms</label>
                            <div className="flex gap-1.5">
                                {["", "1", "2", "3", "4"].map((bd) => (
                                    <button
                                        key={bd}
                                        onClick={() => { setFilters({ ...filters, bedrooms: bd }); setPage(1); }}
                                        className={`flex-1 py-2 rounded-lg text-sm font-medium border transition-colors ${filters.bedrooms === bd
                                            ? "bg-blue-500/10 border-blue-500 text-blue-600 dark:text-blue-400"
                                            : "border-neutral-200 dark:border-neutral-700 text-neutral-600 dark:text-neutral-400"
                                            }`}
                                    >
                                        {bd || "Any"}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Sort */}
                        <div>
                            <label className="block text-sm font-medium mb-1.5">Sort By</label>
                            <select
                                value={`${filters.sortBy}_${filters.sortOrder}`}
                                onChange={(e) => {
                                    const [sortBy, sortOrder] = e.target.value.split("_");
                                    setFilters({ ...filters, sortBy, sortOrder });
                                }}
                                className="w-full px-3 py-2 rounded-xl bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-sm outline-none"
                            >
                                <option value="createdAt_desc">Newest First</option>
                                <option value="createdAt_asc">Oldest First</option>
                                <option value="price_asc">Price: Low to High</option>
                                <option value="price_desc">Price: High to Low</option>
                                <option value="popularityScore_desc">Most Popular</option>
                            </select>
                        </div>
                    </div>
                </aside>

                {/* Property Grid */}
                <div className="flex-1">
                    {loading ? (
                        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
                            {Array.from({ length: 6 }).map((_, i) => (
                                <SkeletonCard key={i} />
                            ))}
                        </div>
                    ) : properties.length === 0 ? (
                        <div className="text-center py-20">
                            <Building2 className="w-12 h-12 text-neutral-300 dark:text-neutral-600 mx-auto mb-4" />
                            <p className="text-neutral-500 dark:text-neutral-400 font-medium">No properties found</p>
                            <p className="text-sm text-neutral-400 dark:text-neutral-500 mt-1">
                                Try adjusting your filters
                            </p>
                        </div>
                    ) : (
                        <>
                            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
                                {properties.map((property) => (
                                    <PropertyCard
                                        key={property.id}
                                        property={property}
                                        onFavorite={handleFavorite}
                                    />
                                ))}
                            </div>

                            {/* Pagination */}
                            {totalPages > 1 && (
                                <div className="flex items-center justify-center gap-2 mt-8">
                                    <button
                                        onClick={() => setPage(Math.max(1, page - 1))}
                                        disabled={page === 1}
                                        className="p-2 rounded-lg border border-neutral-200 dark:border-neutral-700 disabled:opacity-40 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
                                    >
                                        <ChevronLeft className="w-4 h-4" />
                                    </button>
                                    <span className="px-4 py-2 text-sm font-medium">
                                        Page {page} of {totalPages}
                                    </span>
                                    <button
                                        onClick={() => setPage(Math.min(totalPages, page + 1))}
                                        disabled={page === totalPages}
                                        className="p-2 rounded-lg border border-neutral-200 dark:border-neutral-700 disabled:opacity-40 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
                                    >
                                        <ChevronRight className="w-4 h-4" />
                                    </button>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}

export default function PropertiesPage() {
    return (
        <Suspense fallback={
            <div className="max-w-7xl mx-auto px-4 py-8">
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
                    {Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)}
                </div>
            </div>
        }>
            <PropertiesContent />
        </Suspense>
    );
}
