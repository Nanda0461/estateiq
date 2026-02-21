// ─── User Types ──────────────────────────────────────────

export type UserRole = "BUYER" | "SELLER" | "ADMIN";

export interface User {
    id: number;
    email: string;
    name: string;
    role: UserRole;
    isActive?: boolean;
    createdAt?: string;
    updatedAt?: string;
}

// ─── Property Types ──────────────────────────────────────

export type PropertyType = "APARTMENT" | "HOUSE" | "COMMERCIAL" | "LAND";
export type ListingType = "FOR_SALE" | "FOR_RENT";
export type PropertyStatus = "ACTIVE" | "SOLD" | "RENTED" | "ARCHIVED";

export interface Property {
    id: number;
    ownerId: number;
    title: string;
    description: string;
    price: number;
    location: string;
    latitude?: number;
    longitude?: number;
    type: PropertyType;
    listingType: ListingType;
    status: PropertyStatus;
    bedrooms: number;
    bathrooms: number;
    areaSqft: number;
    amenities: string[];
    images: string[];
    viewsCount: number;
    popularityScore: number;
    isDeleted: boolean;
    createdAt: string;
    updatedAt?: string;
}

// ─── Inquiry Types ───────────────────────────────────────

export interface Inquiry {
    id: number;
    propertyId: number;
    buyerId: number;
    message: string;
    createdAt: string;
}

// ─── Supporting Types ────────────────────────────────────

export interface PriceHistory {
    id: number;
    propertyId: number;
    oldPrice: number;
    newPrice: number;
    changedAt: string;
}

export interface Notification {
    id: number;
    userId: number;
    message: string;
    isRead: boolean;
    createdAt: string;
}

export interface Favorite {
    id: number;
    userId: number;
    propertyId: number;
    createdAt: string;
}

export interface RecentView {
    id: number;
    userId: number;
    propertyId: number;
    viewedAt: string;
}

// ─── API Response Types ──────────────────────────────────

export interface ApiResponse<T> {
    success: boolean;
    data: T;
    message?: string;
    error?: string;
}

export interface PaginatedResponse<T> {
    success: boolean;
    data: {
        total: number;
        page: number;
        limit: number;
        results: T[];
    };
}

// ─── Dashboard Types ─────────────────────────────────────

export interface SellerStats {
    totalProperties: number;
    active: number;
    sold: number;
    rented: number;
    totalViews: number;
    totalInquiries: number;
}

// ─── Auth Types ──────────────────────────────────────────

export interface LoginCredentials {
    email: string;
    password: string;
}

export interface RegisterData {
    name: string;
    email: string;
    password: string;
    role: UserRole;
}

// ─── Filter Types ────────────────────────────────────────

export interface PropertyFilters {
    search?: string;
    type?: PropertyType;
    listingType?: ListingType;
    status?: PropertyStatus;
    minPrice?: number;
    maxPrice?: number;
    bedrooms?: number;
    location?: string;
    sortBy?: "price" | "createdAt" | "popularityScore";
    sortOrder?: "asc" | "desc";
    page?: number;
    limit?: number;
}
