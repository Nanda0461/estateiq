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
        }),
    },
    async (input) => {
        const systemPrompt = `You are a real estate expert. Based on the following preferences, provide property recommendations.
        
        IMPORTANT: You MUST return ONLY a valid JSON object.
        Return as JSON with keys: 
        - recommendations (array of objects with keys: suggestion, reasoning, priceRange, matchScore)
        - summary (string)
        
        Schema:
        {
            "recommendations": [{ "suggestion": "string", "reasoning": "string", "priceRange": "string", "matchScore": number }],
            "summary": "string"
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
        };
    }
);
