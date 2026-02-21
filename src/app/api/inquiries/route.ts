import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { auth } from "@/lib/auth";

// GET /api/inquiries — Get inquiries for the current user
export async function GET() {
    try {
        const session = await auth();
        if (!session?.user) {
            return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
        }

        const role = (session.user as { role?: string }).role;
        const userId = Number(session.user.id);

        let inquiries;
        if (role === "SELLER") {
            // Sellers see inquiries on their properties
            inquiries = await prisma.inquiry.findMany({
                where: {
                    property: { ownerId: userId },
                },
                include: {
                    buyer: { select: { id: true, name: true, email: true } },
                    property: { select: { id: true, title: true, location: true, images: true } },
                },
                orderBy: { createdAt: "desc" },
            });
        } else {
            // Buyers see their own inquiries
            inquiries = await prisma.inquiry.findMany({
                where: { buyerId: userId },
                include: {
                    property: {
                        select: { id: true, title: true, location: true, images: true },
                        include: { owner: { select: { id: true, name: true } } },
                    },
                },
                orderBy: { createdAt: "desc" },
            });
        }

        return NextResponse.json({ success: true, data: inquiries });
    } catch (error) {
        console.error("Error fetching inquiries:", error);
        return NextResponse.json(
            { success: false, error: "Failed to fetch inquiries" },
            { status: 500 }
        );
    }
}

// POST /api/inquiries — Send an inquiry (Buyer only)
export async function POST(req: Request) {
    try {
        const session = await auth();
        if (!session?.user) {
            return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
        }

        const { propertyId, message } = await req.json();

        if (!propertyId || !message) {
            return NextResponse.json(
                { success: false, error: "Property ID and message are required" },
                { status: 400 }
            );
        }

        // Check property exists
        const property = await prisma.property.findUnique({
            where: { id: Number(propertyId), isDeleted: false },
        });

        if (!property) {
            return NextResponse.json({ success: false, error: "Property not found" }, { status: 404 });
        }

        // Can't inquire on your own property
        if (property.ownerId === Number(session.user.id)) {
            return NextResponse.json(
                { success: false, error: "Cannot inquire on your own property" },
                { status: 400 }
            );
        }

        const inquiry = await prisma.inquiry.create({
            data: {
                propertyId: Number(propertyId),
                buyerId: Number(session.user.id),
                message,
            },
            include: {
                buyer: { select: { id: true, name: true, email: true } },
                property: { select: { id: true, title: true } },
            },
        });

        // Create notification for the property owner
        await prisma.notification.create({
            data: {
                userId: property.ownerId,
                message: `New inquiry on "${property.title}" from ${session.user.name}`,
            },
        });

        return NextResponse.json(
            { success: true, data: inquiry, message: "Inquiry sent successfully" },
            { status: 201 }
        );
    } catch (error) {
        console.error("Error creating inquiry:", error);
        return NextResponse.json(
            { success: false, error: "Failed to send inquiry" },
            { status: 500 }
        );
    }
}
