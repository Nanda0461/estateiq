import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { auth } from "@/lib/auth";
import { Prisma } from "@prisma/client";

// GET /api/properties — List properties with search/filter/pagination
export async function GET(req: NextRequest) {
    try {
        const session = await auth();
        if (!session?.user) {
            return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
        }

        const { searchParams } = new URL(req.url);

        const search = searchParams.get("search") || undefined;
        const type = searchParams.get("type") || undefined;
        const listingType = searchParams.get("listingType") || undefined;
        const status = searchParams.get("status") || "ACTIVE";
        const minPrice = searchParams.get("minPrice") ? Number(searchParams.get("minPrice")) : undefined;
        const maxPrice = searchParams.get("maxPrice") ? Number(searchParams.get("maxPrice")) : undefined;
        const bedrooms = searchParams.get("bedrooms") ? Number(searchParams.get("bedrooms")) : undefined;
        const location = searchParams.get("location") || undefined;
        const sortBy = searchParams.get("sortBy") || "createdAt";
        const sortOrder = (searchParams.get("sortOrder") || "desc") as "asc" | "desc";
        const page = Math.max(1, Number(searchParams.get("page")) || 1);
        const limit = Math.min(50, Math.max(1, Number(searchParams.get("limit")) || 12));

        const where: Prisma.PropertyWhereInput = {
            isDeleted: false,
            ...(status && { status: status as Prisma.EnumPropertyStatusFilter }),
            ...(type && { type: type as Prisma.EnumPropertyTypeFilter }),
            ...(listingType && { listingType: listingType as Prisma.EnumListingTypeFilter }),
            ...(bedrooms && { bedrooms }),
            ...(minPrice || maxPrice
                ? {
                    price: {
                        ...(minPrice && { gte: minPrice }),
                        ...(maxPrice && { lte: maxPrice }),
                    },
                }
                : {}),
            ...(location && {
                location: { contains: location, mode: "insensitive" as Prisma.QueryMode },
            }),
            ...(search && {
                OR: [
                    { title: { contains: search, mode: "insensitive" as Prisma.QueryMode } },
                    { description: { contains: search, mode: "insensitive" as Prisma.QueryMode } },
                    { location: { contains: search, mode: "insensitive" as Prisma.QueryMode } },
                ],
            }),
        };

        const [total, results] = await Promise.all([
            prisma.property.count({ where }),
            prisma.property.findMany({
                where,
                orderBy: { [sortBy]: sortOrder },
                skip: (page - 1) * limit,
                take: limit,
                include: {
                    owner: {
                        select: { id: true, name: true, email: true },
                    },
                },
            }),
        ]);

        return NextResponse.json({
            success: true,
            data: { total, page, limit, results },
        });
    } catch (error) {
        console.error("Error fetching properties:", error);
        return NextResponse.json(
            { success: false, error: "Failed to fetch properties" },
            { status: 500 }
        );
    }
}

// POST /api/properties — Create a new property (Seller/Admin only)
export async function POST(req: Request) {
    try {
        const session = await auth();
        if (!session?.user) {
            return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
        }

        const role = (session.user as { role?: string }).role;
        if (role !== "SELLER" && role !== "ADMIN") {
            return NextResponse.json({ success: false, error: "Only sellers can create properties" }, { status: 403 });
        }

        const body = await req.json();
        const {
            title, description, price, location, latitude, longitude,
            type, listingType, bedrooms, bathrooms, areaSqft, amenities, images,
        } = body;

        if (!title || !description || !price || !location || !type || !listingType) {
            return NextResponse.json(
                { success: false, error: "Missing required fields" },
                { status: 400 }
            );
        }

        const property = await prisma.property.create({
            data: {
                ownerId: Number(session.user.id),
                title,
                description,
                price: Number(price),
                location,
                latitude: latitude ? Number(latitude) : null,
                longitude: longitude ? Number(longitude) : null,
                type,
                listingType,
                bedrooms: Number(bedrooms) || 0,
                bathrooms: Number(bathrooms) || 0,
                areaSqft: Number(areaSqft) || 0,
                amenities: amenities || [],
                images: images || [],
            },
            include: {
                owner: { select: { id: true, name: true, email: true } },
            },
        });

        return NextResponse.json(
            { success: true, data: property, message: "Property created successfully" },
            { status: 201 }
        );
    } catch (error) {
        console.error("Error creating property:", error);
        return NextResponse.json(
            { success: false, error: "Failed to create property" },
            { status: 500 }
        );
    }
}
