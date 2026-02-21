import { ai } from "../genkit";
import { z } from "zod";
import { generateSarvamContent } from "../sarvam";

export const pricePredictorFlow = ai.defineFlow(
    {
        name: "pricePredictor",
        inputSchema: z.object({
            location: z.string(),
            propertyType: z.string(),
            bedrooms: z.number(),
            bathrooms: z.number(),
            areaSqft: z.number(),
            amenities: z.array(z.string()).optional(),
            listingType: z.string().optional(),
        }),
        outputSchema: z.object({
            estimatedPrice: z.number(),
            priceRange: z.object({
                low: z.number(),
                high: z.number(),
            }),
            confidence: z.number(),
            factors: z.array(
                z.object({
                    factor: z.string(),
                    impact: z.string(),
                })
            ),
            marketInsight: z.string(),
        }),
    },
    async (input) => {
        const systemPrompt = `You are a real estate market analyst. Predict the market price for a property based on details.
        
        IMPORTANT: You MUST return ONLY a valid JSON object.
        Return as JSON with keys: 
        - estimatedPrice (number)
        - priceRange (object with keys: low, high - both numbers)
        - confidence (number, 0-100)
        - factors (array of objects with keys: factor, impact)
        - marketInsight (string)
        
        Schema:
        {
            "estimatedPrice": number,
            "priceRange": { "low": number, "high": number },
            "confidence": number,
            "factors": [{ "factor": "string", "impact": "string" }],
            "marketInsight": "string"
        }`;

        const userPrompt = `
        Location: ${input.location}
        Type: ${input.propertyType}
        Bedrooms: ${input.bedrooms}
        Bathrooms: ${input.bathrooms}
        Area: ${input.areaSqft} sqft
        ${input.amenities?.length ? `Amenities: ${input.amenities.join(", ")}` : ""}
        ${input.listingType ? `Listing Type: ${input.listingType}` : ""}
        `;

        const result = await generateSarvamContent({
            systemPrompt,
            userPrompt,
        });

        return result as {
            estimatedPrice: number;
            priceRange: { low: number; high: number };
            confidence: number;
            factors: { factor: string; impact: string }[];
            marketInsight: string;
        };
    }
);
