import { pricePredictorFlow } from "@/ai/flows/price-predictor";
import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";

export async function POST(req: Request) {
    try {
        const session = await auth();
        if (!session?.user) {
            return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
        }

        const body = await req.json();
        const result = await pricePredictorFlow(body);
        return NextResponse.json(result);
    } catch (error: any) {
        console.error("Price Predictor Error:", error);
        return NextResponse.json({ error: error.message || "Failed to predict price" }, { status: 500 });
    }
}
