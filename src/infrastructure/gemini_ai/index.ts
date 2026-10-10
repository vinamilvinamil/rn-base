

const geminiApikey = process.env.EXPO_PUBLIC_GEMINI_API_KEY;
const GEMINI_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-3.1-flash-lite:generateContent';
if (!geminiApikey) {
    throw new Error('Missing Gemini evn vars')
}

export async function callGemini<T>(
    promptText: String,
    inlineData: {mimeType: string, data: string},
    responseSchema: any
) : Promise<T> {
    const res = await fetch(`${GEMINI_URL}?key=${geminiApikey}`, {
        method: 'POST',
        headers: {'Content-Type': "application/json"},
        body: JSON.stringify({
            contents: [
                {
                    role: 'user',
                    parts: [{text: promptText}, {inlineData}]
                }
            ],
            generationConfig: {
                responseMimeType: "application/json",
                responseSchema: responseSchema
            }
        })
    });
    if(!res.ok) {
        const errorText = await res.text();
        throw new Error(`Gemini request failed: ${errorText}`)
    }
    const data = await res.json();
    const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
    if(!text) throw new Error("No response from Gemini");
    return JSON.parse(text) as T;
}