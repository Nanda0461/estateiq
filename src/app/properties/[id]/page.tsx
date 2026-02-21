"use client";

import { useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";
import { Property } from "@/types";
import { useAuth } from "@/hooks/use-auth";
import {
    MapPin,
    Bed,
    Bath,
    Maximize,
    Eye,
    Heart,
    Calendar,
    MessageSquare,
    ChevronLeft,
    ChevronRight,
    User,
    Send,
} from "lucide-react";
import { toast } from "sonner";
import { AIPropertyInsights } from "@/components/ai-property-insights";

export default function PropertyDetailPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const { id } = use(params);
    const router = useRouter();
    const { user, isAuthenticated } = useAuth();
    const [property, setProperty] = useState<Property & { owner?: { id: number; name: string; email: string }; inquiries?: Array<{ id: number; message: string; createdAt: string; buyer: { id: number; name: string } }> } | null>(null);
    const [loading, setLoading] = useState(true);
    const [currentImage, setCurrentImage] = useState(0);
    const [message, setMessage] = useState("");
    const [sending, setSending] = useState(false);

    useEffect(() => {
        const fetchProperty = async () => {
            try {
                const res = await fetch(`/api/properties/${id}`);
                const data = await res.json();
                if (data.success) {
                    setProperty(data.data);
                } else {
                    toast.error("Property not found");
                    router.push("/properties");
                }
            } catch {
                toast.error("Failed to load property");
            } finally {
                setLoading(false);
            }
        };
        fetchProperty();
    }, [id, router]);

    const handleInquiry = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!isAuthenticated) {
            toast.error("Please login to send inquiries");
            return;
        }
        setSending(true);
        try {
            const res = await fetch("/api/inquiries", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ propertyId: Number(id), message }),
            });
            const data = await res.json();
            if (data.success) {
                toast.success("Inquiry sent successfully!");
                setMessage("");
            } else {
                toast.error(data.error || "Failed to send inquiry");
            }
        } catch {
            toast.error("Failed to send inquiry");
        } finally {
            setSending(false);
        }
    };

    const formatPrice = (price: number) => {
        if (price >= 10000000) return `₹${(price / 10000000).toFixed(1)} Cr`;
        if (price >= 100000) return `₹${(price / 100000).toFixed(1)} L`;
        return `₹${price.toLocaleString()}`;
    };

    if (loading) {
        return (
            <div className="max-w-6xl mx-auto px-4 py-8 space-y-6">
                <div className="h-96 rounded-2xl skeleton" />
                <div className="h-8 w-1/2 rounded-lg skeleton" />
                <div className="h-4 w-1/3 rounded-lg skeleton" />
                <div className="h-40 rounded-lg skeleton" />
            </div>
        );
    }

    if (!property) return null;

    const images = (property.images as string[]) || [];
    const displayImages = images.length > 0 ? images : ["https://placehold.co/800x400/e2e8f0/94a3b8?text=No+Image"];

    return (
        <div className="max-w-6xl mx-auto px-4 py-8">
            {/* Image Gallery */}
            <div className="relative h-[400px] md:h-[500px] rounded-2xl overflow-hidden mb-8 bg-neutral-100 dark:bg-neutral-900">
                <img
                    src={displayImages[currentImage]}
                    alt={property.title}
                    className="w-full h-full object-cover"
                />
                {displayImages.length > 1 && (
                    <>
                        <button
                            onClick={() => setCurrentImage((currentImage - 1 + displayImages.length) % displayImages.length)}
                            className="absolute left-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors"
                        >
                            <ChevronLeft className="w-5 h-5" />
                        </button>
                        <button
                            onClick={() => setCurrentImage((currentImage + 1) % displayImages.length)}
                            className="absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors"
                        >
                            <ChevronRight className="w-5 h-5" />
                        </button>
                        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                            {displayImages.map((_, i) => (
                                <button
                                    key={i}
                                    onClick={() => setCurrentImage(i)}
                                    className={`w-2.5 h-2.5 rounded-full transition-colors ${i === currentImage ? "bg-white" : "bg-white/40"}`}
                                />
                            ))}
                        </div>
                    </>
                )}

                {/* Badges */}
                <div className="absolute top-4 left-4 flex gap-2">
                    <span className={`px-3 py-1.5 rounded-lg text-sm font-semibold ${property.listingType === "FOR_SALE" ? "bg-emerald-500 text-white" : "bg-amber-500 text-white"
                        }`}>
                        {property.listingType === "FOR_SALE" ? "For Sale" : "For Rent"}
                    </span>
                    <span className="px-3 py-1.5 rounded-lg text-sm font-semibold bg-white/90 dark:bg-neutral-800/90 capitalize">
                        {property.type.toLowerCase()}
                    </span>
                </div>
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
                {/* Main Content */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Title & Price */}
                    <div>
                        <h1 className="text-3xl font-bold mb-2">{property.title}</h1>
                        <div className="flex items-center gap-2 text-neutral-500 dark:text-neutral-400 mb-4">
                            <MapPin className="w-4 h-4" />
                            <span>{property.location}</span>
                        </div>
                        <div className="text-3xl font-bold gradient-text">
                            {formatPrice(property.price)}
                            {property.listingType === "FOR_RENT" && (
                                <span className="text-lg font-normal text-neutral-500">/month</span>
                            )}
                        </div>
                    </div>

                    {/* Quick Stats */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                        {[
                            { icon: Bed, label: "Bedrooms", value: property.bedrooms },
                            { icon: Bath, label: "Bathrooms", value: property.bathrooms },
                            { icon: Maximize, label: "Area", value: `${property.areaSqft} sqft` },
                            { icon: Eye, label: "Views", value: property.viewsCount },
                        ].map(({ icon: Icon, label, value }) => (
                            <div key={label} className="p-4 rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-center">
                                <Icon className="w-5 h-5 text-blue-600 dark:text-blue-400 mx-auto mb-1" />
                                <div className="text-lg font-semibold">{value}</div>
                                <div className="text-xs text-neutral-500">{label}</div>
                            </div>
                        ))}
                    </div>

                    {/* Description */}
                    <div className="p-6 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800">
                        <h2 className="text-lg font-semibold mb-3">Description</h2>
                        <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed whitespace-pre-wrap">
                            {property.description}
                        </p>
                    </div>

                    {/* Amenities */}
                    {(property.amenities as string[])?.length > 0 && (
                        <div className="p-6 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800">
                            <h2 className="text-lg font-semibold mb-3">Amenities</h2>
                            <div className="flex flex-wrap gap-2">
                                {(property.amenities as string[]).map((amenity) => (
                                    <span
                                        key={amenity}
                                        className="px-3 py-1.5 rounded-lg bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 text-sm"
                                    >
                                        {amenity}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}

                    <AIPropertyInsights property={property} />
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                    {/* Owner Info */}
                    {property.owner && (
                        <div className="p-6 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800">
                            <h3 className="font-semibold mb-3">Listed By</h3>
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-amber-500 flex items-center justify-center text-white font-bold">
                                    {property.owner.name.charAt(0)}
                                </div>
                                <div>
                                    <div className="font-medium">{property.owner.name}</div>
                                    <div className="text-sm text-neutral-500">{property.owner.email}</div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Inquiry Form */}
                    {user?.id !== String(property.ownerId) && (
                        <form onSubmit={handleInquiry} className="p-6 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800">
                            <h3 className="font-semibold mb-3 flex items-center gap-2">
                                <MessageSquare className="w-4 h-4" />
                                Send Inquiry
                            </h3>
                            <textarea
                                rows={4}
                                placeholder="I'm interested in this property..."
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                                required
                                className="w-full px-3 py-2 rounded-xl bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-sm outline-none focus:border-blue-500 transition-colors resize-none mb-3"
                            />
                            <button
                                type="submit"
                                disabled={sending || !message.trim()}
                                className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-blue-500 text-white font-medium text-sm hover:shadow-lg hover:shadow-blue-500/25 transition-all disabled:opacity-50"
                            >
                                <Send className="w-4 h-4" />
                                {sending ? "Sending..." : "Send Inquiry"}
                            </button>
                        </form>
                    )}

                    {/* Posted Date */}
                    <div className="p-4 rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 flex items-center gap-3 text-sm text-neutral-500 dark:text-neutral-400">
                        <Calendar className="w-4 h-4" />
                        Listed on {new Date(property.createdAt).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
                    </div>
                </div>
            </div>
        </div>
    );
}
