import { propertyRecommenderFlow } from "@/ai/flows/property-recommender";
import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";

export async function POST(req: Request) {
    try {
        const session = await auth();
        if (!session?.user) {
            return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
        }

        const body = await req.json();
        const result = await propertyRecommenderFlow(body);
        return NextResponse.json(result);
    } catch (error: any) {
        console.error("Property Recommender Error:", error);
        return NextResponse.json({ error: error.message || "Failed to get recommendations" }, { status: 500 });
    }
}
