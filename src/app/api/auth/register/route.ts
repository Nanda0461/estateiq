import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/db";
import { generateOTP, sendVerificationEmail } from "@/lib/auth-utils";

export async function POST(req: Request) {
    try {
        const { name, email, password, role } = await req.json();

        // Validate input
        if (!name || !email || !password) {
            return NextResponse.json(
                { success: false, error: "Name, email, and password are required" },
                { status: 400 }
            );
        }

        // Check if user already exists
        const existingUser = await prisma.user.findUnique({
            where: { email },
        });

        if (existingUser) {
            return NextResponse.json(
                { success: false, error: "Email already registered" },
                { status: 409 }
            );
        }

        // Hash password
        const passwordHash = await bcrypt.hash(password, 12);

        // Generate OTP
        const otp = generateOTP();
        const expires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes from now

        // Create user (isActive: false) and VerificationToken in a transaction
        const [user] = await prisma.$transaction([
            prisma.user.create({
                data: {
                    name,
                    email,
                    passwordHash,
                    role: role || "BUYER",
                    isActive: false, // User is inactive until verified
                },
                select: {
                    id: true,
                    name: true,
                    email: true,
                    role: true,
                    createdAt: true,
                },
            }),
            prisma.verificationToken.create({
                data: {
                    identifier: email,
                    token: otp,
                    expires,
                },
            }),
        ]);

        // Send verification email
        await sendVerificationEmail(email, otp);

        return NextResponse.json(
            {
                success: true,
                data: user,
                message: "Registration successful. Please verify your email."
            },
            { status: 201 }
        );
    } catch (error) {
        console.error("Registration error:", error);
        return NextResponse.json(
            { success: false, error: "Internal server error" },
            { status: 500 }
        );
    }
}
