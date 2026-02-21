import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { auth } from "@/lib/auth";

// GET /api/admin — Get admin overview
export async function GET() {
    try {
        const session = await auth();
        if (!session?.user) {
            return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
        }

        const role = (session.user as { role?: string }).role;
        if (role !== "ADMIN") {
            return NextResponse.json({ success: false, error: "Forbidden" }, { status: 403 });
        }

        const [totalUsers, totalProperties, totalInquiries, recentUsers, recentProperties] =
            await Promise.all([
                prisma.user.count(),
                prisma.property.count({ where: { isDeleted: false } }),
                prisma.inquiry.count(),
                prisma.user.findMany({
                    orderBy: { createdAt: "desc" },
                    take: 10,
                    select: { id: true, name: true, email: true, role: true, isActive: true, createdAt: true },
                }),
                prisma.property.findMany({
                    where: { isDeleted: false },
                    orderBy: { createdAt: "desc" },
                    take: 10,
                    include: { owner: { select: { id: true, name: true } } },
                }),
            ]);

        return NextResponse.json({
            success: true,
            data: {
                stats: { totalUsers, totalProperties, totalInquiries },
                recentUsers,
                recentProperties,
            },
        });
    } catch (error) {
        console.error("Error fetching admin data:", error);
        return NextResponse.json(
            { success: false, error: "Failed to fetch admin data" },
            { status: 500 }
        );
    }
}
