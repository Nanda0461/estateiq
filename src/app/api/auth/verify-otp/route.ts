import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function POST(req: Request) {
    try {
        const { email, otp } = await req.json();

        if (!email || !otp) {
            return NextResponse.json(
                { success: false, error: "Email and OTP are required" },
                { status: 400 }
            );
        }

        // Find the verification token
        const verificationToken = await prisma.verificationToken.findFirst({
            where: {
                identifier: email,
                token: otp,
                expires: { gt: new Date() }
            }
        });

        if (!verificationToken) {
            return NextResponse.json(
                { success: false, error: "Invalid or expired OTP" },
                { status: 400 }
            );
        }

        // Mark user as active and email as verified
        await prisma.$transaction([
            prisma.user.update({
                where: { email },
                data: {
                    isActive: true,
                    emailVerified: new Date(),
                }
            }),
            prisma.verificationToken.delete({
                where: {
                    identifier_token: {
                        identifier: email,
                        token: otp
                    }
                }
            })
        ]);

        return NextResponse.json(
            { success: true, message: "Email verified successfully" },
            { status: 200 }
        );
    } catch (error) {
        console.error("Verification error:", error);
        return NextResponse.json(
            { success: false, error: "Internal server error" },
            { status: 500 }
        );
    }
}
