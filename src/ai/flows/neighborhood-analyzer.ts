import { ai } from "../genkit";
import { z } from "zod";
import { generateSarvamContent } from "../sarvam";

export const neighborhoodAnalyzerFlow = ai.defineFlow(
    {
        name: "neighborhoodAnalyzer",
        inputSchema: z.object({
            location: z.string().describe("Neighborhood or area to analyze"),
            propertyType: z.string().optional(),
        }),
        outputSchema: z.object({
            overview: z.string(),
            ratings: z.object({
                safety: z.number(),
                schools: z.number(),
                transportation: z.number(),
                shopping: z.number(),
                dining: z.number(),
                parks: z.number(),
                overall: z.number(),
            }),
            highlights: z.array(z.string()),
            considerations: z.array(z.string()),
            averagePrice: z.string(),
        }),
    },
    async (input) => {
        const systemPrompt = `You are a neighborhood expert. Analyze the following area for someone looking to ${input.propertyType ? `find a ${input.propertyType} in` : "move to"} this location.
        
        IMPORTANT: You MUST return ONLY a valid JSON object. 
        Return as JSON with keys: 
        - overview (string)
        - ratings (object with keys: safety, schools, transportation, shopping, dining, parks, overall - all numbers 1-10)
        - highlights (array of strings, 3-5 items)
        - considerations (array of strings, 2-3 items)
        - averagePrice (string, e.g. "₹85L - ₹1.2Cr")
        
        Schema:
        {
            "overview": "string",
            "ratings": { "safety": number, "schools": number, "transportation": number, "shopping": number, "dining": number, "parks": number, "overall": number },
            "highlights": ["string"],
            "considerations": ["string"],
            "averagePrice": "string"
        }`;

        const userPrompt = `Location: ${input.location}`;

        const result = await generateSarvamContent({
            systemPrompt,
            userPrompt,
        });

        return result as {
            overview: string;
            ratings: {
                safety: number;
                schools: number;
                transportation: number;
                shopping: number;
                dining: number;
                parks: number;
                overall: number;
            };
            highlights: string[];
            considerations: string[];
            averagePrice: string;
        };
    }
);
