import { ai } from "../genkit";
import { z } from "zod";
import { generateSarvamContent } from "../sarvam";

export const propertyRecommenderFlow = ai.defineFlow(
    {
        name: "propertyRecommender",
        inputSchema: z.object({
            preferences: z.string().describe("User preferences for property search"),
            budget: z.number().optional().describe("Maximum budget"),
            location: z.string().optional().describe("Preferred location"),
            propertyType: z.string().optional().describe("Type of property"),
        }),
        outputSchema: z.object({
            recommendations: z.array(
                z.object({
                    suggestion: z.string(),
                    reasoning: z.string(),
                    priceRange: z.string(),
                    matchScore: z.number(),
                })
            ),
            summary: z.string(),
            filters: z.object({
                search: z.string().optional(),
                listingType: z.string().optional(),
                type: z.string().optional(),
                bedrooms: z.string().optional(),
                maxPrice: z.string().optional(),
            }).optional(),
        }),
    },
    async (input) => {
        const systemPrompt = `You are a real estate expert. Based on the following preferences, provide property recommendations and EXTRACT structured filters for the application.
        
        IMPORTANT: You MUST return ONLY a valid JSON object.
        Return as JSON with keys: 
        - recommendations (array of objects with keys: suggestion, reasoning, priceRange, matchScore)
        - summary (string)
        - filters (object with optional keys: search, listingType, type, bedrooms, maxPrice)
        
        listingType should be "FOR_SALE" or "FOR_RENT".
        type should be "APARTMENT", "HOUSE", or "VILLA".
        bedrooms should be "1", "2", "3", or "4" (for 4+).
        
        Example filters mapping:
        "3 BHK" -> bedrooms: "3"
        "rent" -> listingType: "FOR_RENT"
        "buy" -> listingType: "FOR_SALE"
        
        Schema:
        {
            "recommendations": [{ "suggestion": "string", "reasoning": "string", "priceRange": "string", "matchScore": number }],
            "summary": "string",
            "filters": { "search": "string", "listingType": "FOR_SALE|FOR_RENT", "type": "APARTMENT|HOUSE|VILLA", "bedrooms": "1|2|3|4", "maxPrice": "string" }
        }`;

        const userPrompt = `
        User Preferences: ${input.preferences}
        ${input.budget ? `Budget: $${input.budget}` : ""}
        ${input.location ? `Preferred Location: ${input.location}` : ""}
        ${input.propertyType ? `Property Type: ${input.propertyType}` : ""}
        `;

        const result = await generateSarvamContent({
            systemPrompt,
            userPrompt,
        });

        return result as {
            recommendations: {
                suggestion: string;
                reasoning: string;
                priceRange: string;
                matchScore: number;
            }[];
            summary: string;
            filters?: any;
        };
    }
);
