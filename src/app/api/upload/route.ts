import { NextResponse } from "next/server";
import { uploadImage } from "@/lib/cloudinary";
import { auth } from "@/lib/auth";

// POST /api/upload — Upload image to Cloudinary
export async function POST(req: Request) {
    try {
        const session = await auth();
        if (!session?.user) {
            return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
        }

        const formData = await req.formData();
        const file = formData.get("file") as File;

        if (!file) {
            return NextResponse.json(
                { success: false, error: "No file provided" },
                { status: 400 }
            );
        }

        // Convert file to base64 data URI
        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);
        const base64 = `data:${file.type};base64,${buffer.toString("base64")}`;

        const result = await uploadImage(base64, "real-estate/properties");

        return NextResponse.json(
            { success: true, data: result },
            { status: 201 }
        );
    } catch (error) {
        console.error("Error uploading image:", error);
        return NextResponse.json(
            { success: false, error: "Failed to upload image" },
            { status: 500 }
        );
    }
}
