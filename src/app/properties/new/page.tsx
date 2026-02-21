"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/use-auth";
import { PlusCircle, Upload, X, Loader2 } from "lucide-react";
import { toast } from "sonner";

export default function AddPropertyPage() {
    const router = useRouter();
    const { user } = useAuth();
    const [loading, setLoading] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [form, setForm] = useState({
        title: "",
        description: "",
        price: "",
        location: "",
        type: "APARTMENT",
        listingType: "FOR_SALE",
        bedrooms: "1",
        bathrooms: "1",
        areaSqft: "",
        amenities: [] as string[],
        images: [] as string[],
    });
    const [amenityInput, setAmenityInput] = useState("");

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setUploading(true);
        try {
            const formData = new FormData();
            formData.append("file", file);
            const res = await fetch("/api/upload", { method: "POST", body: formData });
            const data = await res.json();
            if (data.success) {
                setForm({ ...form, images: [...form.images, data.data.url] });
                toast.success("Image uploaded!");
            } else {
                toast.error("Failed to upload image");
            }
        } catch {
            toast.error("Upload failed");
        } finally {
            setUploading(false);
        }
    };

    const addAmenity = () => {
        if (amenityInput.trim() && !form.amenities.includes(amenityInput.trim())) {
            setForm({ ...form, amenities: [...form.amenities, amenityInput.trim()] });
            setAmenityInput("");
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await fetch("/api/properties", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    ...form,
                    price: Number(form.price),
                    bedrooms: Number(form.bedrooms),
                    bathrooms: Number(form.bathrooms),
                    areaSqft: Number(form.areaSqft),
                }),
            });
            const data = await res.json();
            if (data.success) {
                toast.success("Property listed successfully!");
                router.push("/dashboard");
            } else {
                toast.error(data.error || "Failed to create property");
            }
        } catch {
            toast.error("Something went wrong");
        } finally {
            setLoading(false);
        }
    };

    const inputClass = "w-full px-3 py-2.5 rounded-xl bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all";

    return (
        <div className="max-w-3xl mx-auto px-4 py-8">
            <h1 className="text-2xl font-bold mb-6 flex items-center gap-2">
                <PlusCircle className="w-6 h-6" />
                Add New Property
            </h1>

            <form onSubmit={handleSubmit} className="p-6 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 space-y-5">
                {/* Title */}
                <div>
                    <label className="block text-sm font-medium mb-1.5">Property Title *</label>
                    <input type="text" required value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="Luxury 3BHK Apartment in Downtown" className={inputClass} />
                </div>

                {/* Type & Listing Type */}
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium mb-1.5">Property Type *</label>
                        <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })} className={inputClass}>
                            <option value="APARTMENT">Apartment</option>
                            <option value="HOUSE">House</option>
                            <option value="COMMERCIAL">Commercial</option>
                            <option value="LAND">Land</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1.5">Listing Type *</label>
                        <select value={form.listingType} onChange={(e) => setForm({ ...form, listingType: e.target.value })} className={inputClass}>
                            <option value="FOR_SALE">For Sale</option>
                            <option value="FOR_RENT">For Rent</option>
                        </select>
                    </div>
                </div>

                {/* Price & Area */}
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium mb-1.5">Price (₹) *</label>
                        <input type="number" required value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} placeholder="5000000" className={inputClass} />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1.5">Area (sqft) *</label>
                        <input type="number" required value={form.areaSqft} onChange={(e) => setForm({ ...form, areaSqft: e.target.value })} placeholder="1200" className={inputClass} />
                    </div>
                </div>

                {/* Bedrooms & Bathrooms */}
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium mb-1.5">Bedrooms</label>
                        <select value={form.bedrooms} onChange={(e) => setForm({ ...form, bedrooms: e.target.value })} className={inputClass}>
                            {[1, 2, 3, 4, 5, 6].map((n) => <option key={n} value={n}>{n}</option>)}
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1.5">Bathrooms</label>
                        <select value={form.bathrooms} onChange={(e) => setForm({ ...form, bathrooms: e.target.value })} className={inputClass}>
                            {[1, 2, 3, 4, 5].map((n) => <option key={n} value={n}>{n}</option>)}
                        </select>
                    </div>
                </div>

                {/* Location */}
                <div>
                    <label className="block text-sm font-medium mb-1.5">Location *</label>
                    <input type="text" required value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} placeholder="Koramangala, Bangalore" className={inputClass} />
                </div>

                {/* Description */}
                <div>
                    <label className="block text-sm font-medium mb-1.5">Description *</label>
                    <textarea rows={4} required value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Describe your property..." className={`${inputClass} resize-none`} />
                </div>

                {/* Amenities */}
                <div>
                    <label className="block text-sm font-medium mb-1.5">Amenities</label>
                    <div className="flex gap-2 mb-2">
                        <input type="text" value={amenityInput} onChange={(e) => setAmenityInput(e.target.value)} onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addAmenity())} placeholder="Add amenity..." className={`flex-1 ${inputClass}`} />
                        <button type="button" onClick={addAmenity} className="px-4 py-2 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400 text-sm font-medium hover:bg-blue-500/20 transition-colors">Add</button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                        {form.amenities.map((a) => (
                            <span key={a} className="inline-flex items-center gap-1 px-3 py-1 rounded-lg bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 text-sm">
                                {a}
                                <button type="button" onClick={() => setForm({ ...form, amenities: form.amenities.filter((x) => x !== a) })}>
                                    <X className="w-3 h-3" />
                                </button>
                            </span>
                        ))}
                    </div>
                </div>

                {/* Images */}
                <div>
                    <label className="block text-sm font-medium mb-1.5">Images</label>
                    <div className="flex flex-wrap gap-3 mb-3">
                        {form.images.map((img, i) => (
                            <div key={i} className="relative w-24 h-24 rounded-xl overflow-hidden border border-neutral-200 dark:border-neutral-700">
                                <img src={img} alt="" className="w-full h-full object-cover" />
                                <button type="button" onClick={() => setForm({ ...form, images: form.images.filter((_, j) => j !== i) })} className="absolute top-1 right-1 p-0.5 rounded-full bg-red-500 text-white">
                                    <X className="w-3 h-3" />
                                </button>
                            </div>
                        ))}
                        <label className="w-24 h-24 rounded-xl border-2 border-dashed border-neutral-300 dark:border-neutral-600 flex items-center justify-center cursor-pointer hover:border-blue-500 transition-colors">
                            {uploading ? <Loader2 className="w-5 h-5 animate-spin text-blue-500" /> : <Upload className="w-5 h-5 text-neutral-400" />}
                            <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} disabled={uploading} />
                        </label>
                    </div>
                </div>

                {/* Submit */}
                <button type="submit" disabled={loading} className="w-full py-3 rounded-xl bg-gradient-to-r from-blue-600 to-blue-500 text-white font-medium hover:shadow-lg hover:shadow-blue-500/25 transition-all disabled:opacity-50">
                    {loading ? "Creating..." : "List Property"}
                </button>
            </form>
        </div>
    );
}
