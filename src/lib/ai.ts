import { GoogleGenAI } from '@google/genai';

export async function generateAITaskBreakdown(goal: string): Promise<string[]> {
  const apiKey = process.env.GEMINI_API_KEY;
  
  // Graceful fallback if user hasn't added API Key
  if (!apiKey) {
    return [
      `Research core concepts for: ${goal}`,
      `Draft initial plan/architecture for: ${goal}`,
      `Implement MVP of: ${goal}`,
      `Review and refine: ${goal}`
    ];
  }

  const ai = new GoogleGenAI({ apiKey });
  
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `You are an expert project manager. Break down the following goal into 3-5 actionable, highly specific, and manageable tasks. Do not include titles or markdown formatting. Return ONLY a valid JSON array of strings, nothing else. Goal: ${goal}`,
      config: {
        responseMimeType: "application/json",
      }
    });

    if (response.text) {
        const textStr = response.text.trim();
        // Fallback cleanup if the model included markdown ticks
        const cln = textStr.replace(/^```json/, '').replace(/^```/, '').replace(/```$/, '').trim();
        return JSON.parse(cln);
    }
    return [];
  } catch (error) {
    console.error("AI Generation Failed:", error);
    return [];
  }
}
