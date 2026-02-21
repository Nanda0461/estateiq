import { ai } from "../genkit";
import { z } from "zod";
import { generateSarvamContent } from "../sarvam";

export const propertyChatbotFlow = ai.defineFlow(
    {
        name: "propertyChatbot",
        inputSchema: z.object({
            message: z.string().describe("User message/question"),
            conversationHistory: z
                .array(
                    z.object({
                        role: z.enum(["user", "assistant"]),
                        content: z.string(),
                    })
                )
                .optional()
                .describe("Previous conversation messages"),
            propertyContext: z.string().optional().describe("Current property details if viewing one"),
        }),
        outputSchema: z.object({
            response: z.string(),
            suggestedActions: z.array(z.string()).optional(),
        }),
    },
    async (input) => {
        const historyText = input.conversationHistory
            ?.map((m) => `${m.role}: ${m.content}`)
            .join("\n") || "";

        const systemPrompt = `You are a helpful real estate assistant chatbot. Help users with property-related questions.
        
        IMPORTANT: You MUST return ONLY a valid JSON object.
        Return as JSON with keys: 
        - response (string)
        - suggestedActions (optional array of strings)
        
        Schema:
        {
            "response": "string",
            "suggestedActions": ["string"]
        }`;

        const userPrompt = `
        ${historyText ? `Previous conversation:\n${historyText}\n` : ""}
        ${input.propertyContext ? `Current property context:\n${input.propertyContext}\n` : ""}
        
        User question: ${input.message}
        `;

        const result = await generateSarvamContent({
            systemPrompt,
            userPrompt,
            history: input.conversationHistory,
        });

        return result as {
            response: string;
            suggestedActions?: string[];
        };
    }
);
