import { auth } from "@/lib/auth"
import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export async function proxy(req: NextRequest) {
    const session = await auth()
    const { pathname } = req.nextUrl

    // Protected routes that require authentication
    const protectedPaths = ["/dashboard", "/profile", "/favorites", "/admin"];
    const isProtected = protectedPaths.some((path) => pathname.startsWith(path));

    if (isProtected && !session) {
        return NextResponse.redirect(new URL("/login", req.url));
    }

    // Role-based protection: Admin only
    if (pathname.startsWith("/admin") && (session?.user as any)?.role !== "ADMIN") {
        return NextResponse.redirect(new URL("/", req.url));
    }

    // Role-based protection: Seller/Admin for management
    if ((pathname.startsWith("/properties/new")) &&
        (session?.user as any)?.role !== "SELLER" &&
        (session?.user as any)?.role !== "ADMIN") {
        return NextResponse.redirect(new URL("/", req.url));
    }

    return NextResponse.next();
}

export default proxy;

export const config = {
    matcher: [
        "/dashboard/:path*",
        "/profile/:path*",
        "/favorites/:path*",
        "/properties/new",
        "/properties/:id/edit",
        "/admin/:path*",
    ],
};
