import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { auth } from "@/lib/auth";

// GET /api/properties/[id] — Get property details
export async function GET(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const session = await auth();
        if (!session?.user) {
            return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
        }

        const { id } = await params;
        const property = await prisma.property.findUnique({
            where: { id: Number(id), isDeleted: false },
            include: {
                owner: { select: { id: true, name: true, email: true } },
                inquiries: {
                    include: {
                        buyer: { select: { id: true, name: true } },
                    },
                    orderBy: { createdAt: "desc" },
                },
                priceHistory: { orderBy: { changedAt: "desc" } },
            },
        });

        if (!property) {
            return NextResponse.json(
                { success: false, error: "Property not found" },
                { status: 404 }
            );
        }

        // Increment views count
        await prisma.property.update({
            where: { id: Number(id) },
            data: { viewsCount: { increment: 1 } },
        });

        // Track recent view if user is authenticated
        if (session?.user) {
            await prisma.recentView.upsert({
                where: {
                    userId_propertyId: {
                        userId: Number(session.user.id),
                        propertyId: Number(id),
                    },
                },
                update: { viewedAt: new Date() },
                create: {
                    userId: Number(session.user.id),
                    propertyId: Number(id),
                },
            });
        }

        return NextResponse.json({ success: true, data: property });
    } catch (error) {
        console.error("Error fetching property:", error);
        return NextResponse.json(
            { success: false, error: "Failed to fetch property" },
            { status: 500 }
        );
    }
}

// PUT /api/properties/[id] — Update property (Owner only)
export async function PUT(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const session = await auth();
        if (!session?.user) {
            return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
        }

        const { id } = await params;
        const existing = await prisma.property.findUnique({
            where: { id: Number(id) },
        });

        if (!existing || existing.isDeleted) {
            return NextResponse.json({ success: false, error: "Property not found" }, { status: 404 });
        }

        const role = (session.user as { role?: string }).role;
        if (existing.ownerId !== Number(session.user.id) && role !== "ADMIN") {
            return NextResponse.json({ success: false, error: "Forbidden" }, { status: 403 });
        }

        const body = await req.json();

        // Track price change if price is being updated
        if (body.price && body.price !== existing.price) {
            await prisma.priceHistory.create({
                data: {
                    propertyId: Number(id),
                    oldPrice: existing.price,
                    newPrice: Number(body.price),
                },
            });
        }

        const updated = await prisma.property.update({
            where: { id: Number(id) },
            data: {
                ...(body.title && { title: body.title }),
                ...(body.description && { description: body.description }),
                ...(body.price && { price: Number(body.price) }),
                ...(body.location && { location: body.location }),
                ...(body.latitude !== undefined && { latitude: body.latitude }),
                ...(body.longitude !== undefined && { longitude: body.longitude }),
                ...(body.type && { type: body.type }),
                ...(body.listingType && { listingType: body.listingType }),
                ...(body.status && { status: body.status }),
                ...(body.bedrooms !== undefined && { bedrooms: Number(body.bedrooms) }),
                ...(body.bathrooms !== undefined && { bathrooms: Number(body.bathrooms) }),
                ...(body.areaSqft !== undefined && { areaSqft: Number(body.areaSqft) }),
                ...(body.amenities && { amenities: body.amenities }),
                ...(body.images && { images: body.images }),
            },
            include: {
                owner: { select: { id: true, name: true, email: true } },
            },
        });

        return NextResponse.json({
            success: true,
            data: updated,
            message: "Property updated successfully",
        });
    } catch (error) {
        console.error("Error updating property:", error);
        return NextResponse.json(
            { success: false, error: "Failed to update property" },
            { status: 500 }
        );
    }
}

// DELETE /api/properties/[id] — Soft delete property (Owner only)
export async function DELETE(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const session = await auth();
        if (!session?.user) {
            return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
        }

        const { id } = await params;
        const existing = await prisma.property.findUnique({
            where: { id: Number(id) },
        });

        if (!existing || existing.isDeleted) {
            return NextResponse.json({ success: false, error: "Property not found" }, { status: 404 });
        }

        const role = (session.user as { role?: string }).role;
        if (existing.ownerId !== Number(session.user.id) && role !== "ADMIN") {
            return NextResponse.json({ success: false, error: "Forbidden" }, { status: 403 });
        }

        // Soft delete
        await prisma.property.update({
            where: { id: Number(id) },
            data: { isDeleted: true, status: "ARCHIVED" },
        });

        return new NextResponse(null, { status: 204 });
    } catch (error) {
        console.error("Error deleting property:", error);
        return NextResponse.json(
            { success: false, error: "Failed to delete property" },
            { status: 500 }
        );
    }
}
