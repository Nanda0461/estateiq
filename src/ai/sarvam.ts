export async function generateSarvamContent({
    systemPrompt,
    userPrompt,
    history = [],
}: {
    systemPrompt: string;
    userPrompt: string;
    history?: { role: "user" | "assistant"; content: string }[];
}) {
    const apiKey = process.env.SARVAM_API_KEY;

    if (!apiKey || apiKey === "your_sarvam_api_key_here") {
        throw new Error("Sarvam API Key is missing or invalid. Please set SARVAM_API_KEY in your .env file.");
    }

    const messages = [
        { role: "system", content: systemPrompt },
        ...history,
        { role: "user", content: userPrompt },
    ];

    try {
        const response = await fetch("https://api.sarvam.ai/v1/chat/completions", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "api-subscription-key": apiKey,
            },
            body: JSON.stringify({
                model: "sarvam-m",
                messages,
                temperature: 0.1, // Low temperature for consistent JSON
            }),
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            console.error("Sarvam API Error:", errorData);
            throw new Error(`Sarvam AI API request failed with status ${response.status}`);
        }

        const data = await response.json();
        const content = data.choices[0]?.message?.content;

        if (!content) {
            throw new Error("Sarvam AI returned an empty response.");
        }

        // Try to parse JSON if the prompt expects it
        if (systemPrompt.toLowerCase().includes("json") || userPrompt.toLowerCase().includes("json")) {
            try {
                // Find JSON block if it's wrapped in markdown
                const jsonMatch = content.match(/```json\n([\s\S]*?)\n```/) || content.match(/{[\s\S]*}/);
                const jsonString = jsonMatch ? jsonMatch[0] : content;
                return JSON.parse(jsonString);
            } catch (e) {
                console.error("Failed to parse Sarvam response as JSON:", content);
                throw new Error("Sarvam AI response was not valid JSON.");
            }
        }

        return content;
    } catch (error: any) {
        console.error("generateSarvamContent error:", error);
        throw error;
    }
}
