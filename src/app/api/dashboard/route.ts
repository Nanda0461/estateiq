import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { auth } from "@/lib/auth";

// GET /api/dashboard — Get seller dashboard stats
export async function GET() {
    try {
        const session = await auth();
        if (!session?.user) {
            return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
        }

        const userId = Number(session.user.id);

        const [properties, inquiriesCount] = await Promise.all([
            prisma.property.findMany({
                where: { ownerId: userId, isDeleted: false },
                select: {
                    id: true,
                    status: true,
                    viewsCount: true,
                },
            }),
            prisma.inquiry.count({
                where: {
                    property: { ownerId: userId },
                },
            }),
        ]);

        const stats = {
            totalProperties: properties.length,
            active: properties.filter((p) => p.status === "ACTIVE").length,
            sold: properties.filter((p) => p.status === "SOLD").length,
            rented: properties.filter((p) => p.status === "RENTED").length,
            totalViews: properties.reduce((sum, p) => sum + p.viewsCount, 0),
            totalInquiries: inquiriesCount,
        };

        // Get recent properties with details
        const recentProperties = await prisma.property.findMany({
            where: { ownerId: userId, isDeleted: false },
            orderBy: { createdAt: "desc" },
            take: 5,
            include: {
                _count: { select: { inquiries: true } },
            },
        });

        return NextResponse.json({
            success: true,
            data: { stats, recentProperties },
        });
    } catch (error) {
        console.error("Error fetching dashboard data:", error);
        return NextResponse.json(
            { success: false, error: "Failed to fetch dashboard data" },
            { status: 500 }
        );
    }
}
