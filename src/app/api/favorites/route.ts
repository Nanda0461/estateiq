import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { auth } from "@/lib/auth";

// GET /api/favorites — Get user's favorites
export async function GET() {
    try {
        const session = await auth();
        if (!session?.user) {
            return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
        }

        const favorites = await prisma.favorite.findMany({
            where: { userId: Number(session.user.id) },
            include: {
                property: {
                    include: {
                        owner: { select: { id: true, name: true } },
                    },
                },
            },
            orderBy: { createdAt: "desc" },
        });

        return NextResponse.json({
            success: true,
            data: favorites.map((f) => f.property),
        });
    } catch (error) {
        console.error("Error fetching favorites:", error);
        return NextResponse.json(
            { success: false, error: "Failed to fetch favorites" },
            { status: 500 }
        );
    }
}

// POST /api/favorites — Add to favorites
export async function POST(req: Request) {
    try {
        const session = await auth();
        if (!session?.user) {
            return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
        }

        const { propertyId } = await req.json();

        if (!propertyId) {
            return NextResponse.json(
                { success: false, error: "Property ID is required" },
                { status: 400 }
            );
        }

        const favorite = await prisma.favorite.upsert({
            where: {
                userId_propertyId: {
                    userId: Number(session.user.id),
                    propertyId: Number(propertyId),
                },
            },
            update: {},
            create: {
                userId: Number(session.user.id),
                propertyId: Number(propertyId),
            },
        });

        return NextResponse.json(
            { success: true, data: favorite, message: "Added to favorites" },
            { status: 201 }
        );
    } catch (error) {
        console.error("Error adding favorite:", error);
        return NextResponse.json(
            { success: false, error: "Failed to add favorite" },
            { status: 500 }
        );
    }
}

// DELETE /api/favorites — Remove from favorites
export async function DELETE(req: Request) {
    try {
        const session = await auth();
        if (!session?.user) {
            return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
        }

        const { searchParams } = new URL(req.url);
        const propertyId = searchParams.get("propertyId");

        if (!propertyId) {
            return NextResponse.json(
                { success: false, error: "Property ID is required" },
                { status: 400 }
            );
        }

        await prisma.favorite.delete({
            where: {
                userId_propertyId: {
                    userId: Number(session.user.id),
                    propertyId: Number(propertyId),
                },
            },
        });

        return new NextResponse(null, { status: 204 });
    } catch (error) {
        console.error("Error removing favorite:", error);
        return NextResponse.json(
            { success: false, error: "Failed to remove favorite" },
            { status: 500 }
        );
    }
}
