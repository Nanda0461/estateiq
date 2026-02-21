import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { auth } from "@/lib/auth";

// GET /api/notifications — Get user notifications
export async function GET() {
    try {
        const session = await auth();
        if (!session?.user) {
            return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
        }

        const notifications = await prisma.notification.findMany({
            where: { userId: Number(session.user.id) },
            orderBy: { createdAt: "desc" },
            take: 50,
        });

        return NextResponse.json({ success: true, data: notifications });
    } catch (error) {
        console.error("Error fetching notifications:", error);
        return NextResponse.json(
            { success: false, error: "Failed to fetch notifications" },
            { status: 500 }
        );
    }
}

// PUT /api/notifications — Mark notifications as read
export async function PUT(req: Request) {
    try {
        const session = await auth();
        if (!session?.user) {
            return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
        }

        const { ids } = await req.json();

        if (ids && Array.isArray(ids)) {
            await prisma.notification.updateMany({
                where: {
                    id: { in: ids.map(Number) },
                    userId: Number(session.user.id),
                },
                data: { isRead: true },
            });
        } else {
            // Mark all as read
            await prisma.notification.updateMany({
                where: { userId: Number(session.user.id) },
                data: { isRead: true },
            });
        }

        return NextResponse.json({ success: true, message: "Notifications marked as read" });
    } catch (error) {
        console.error("Error updating notifications:", error);
        return NextResponse.json(
            { success: false, error: "Failed to update notifications" },
            { status: 500 }
        );
    }
}
