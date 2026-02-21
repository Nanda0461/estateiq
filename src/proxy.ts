import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

export async function proxy(req: NextRequest) {
    const { pathname } = req.nextUrl;

    // Protected routes that require authentication
    const protectedPaths = ["/dashboard", "/profile", "/favorites", "/properties/new", "/admin"];
    const isProtected = protectedPaths.some((path) => pathname.startsWith(path));

    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

    if (isProtected && !token) {
        return NextResponse.redirect(new URL("/login", req.url));
    }

    // Admin-only routes
    if (pathname.startsWith("/admin") && token?.role !== "ADMIN") {
        return NextResponse.redirect(new URL("/", req.url));
    }

    // Seller-only routes
    if (
        (pathname.startsWith("/properties/new") || pathname.includes("/edit")) &&
        token?.role !== "SELLER" &&
        token?.role !== "ADMIN"
    ) {
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
