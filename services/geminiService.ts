
import { GoogleGenAI, Type } from "@google/genai";

const SYSTEM_INSTRUCTION = `
You are 'SilverCare AI', a compassionate, patient, and knowledgeable medical assistant specifically for elderly users. 
Your goal is to provide clear, simple explanations for prescriptions and address health concerns in an easy-to-understand way.

Guidelines:
1. Use large, simple words. Avoid complex medical jargon unless explaining it simply.
2. Be extremely empathetic and reassuring.
3. CRITICAL: Always include a disclaimer that you are an AI and the user should consult their human doctor for serious issues or changes in medication.
4. If asked about a specific prescription, explain what it is generally used for and common side effects to watch for.
5. Keep responses concise but thorough.
6. Support multiple languages if the user speaks in one.
7. Format responses with clear headings or bullet points for readability.
`;

export const getGeminiChatResponse = async (userMessage: string, history: { role: 'user' | 'model', parts: { text: string }[] }[]) => {
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: [
        ...history,
        { role: 'user', parts: [{ text: userMessage }] }
      ],
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        temperature: 0.7,
      }
    });
    return response.text || "I'm sorry, I couldn't process that. Could you try rephrasing?";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "I'm having a little trouble connecting right now.";
  }
};

export const parsePrescriptionImage = async (base64Image: string) => {
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: [
        {
          role: 'user',
          parts: [
            {
              inlineData: {
                mimeType: 'image/jpeg',
                data: base64Image.split(',')[1] || base64Image
              }
            },
            { text: "Analyze this prescription image and extract the medication details. Return a JSON object with: name, dosage, frequency, reminderTime (HH:mm format), and instructions." }
          ]
        }
      ],
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            name: { type: Type.STRING },
            dosage: { type: Type.STRING },
            frequency: { type: Type.STRING },
            reminderTime: { type: Type.STRING },
            instructions: { type: Type.STRING }
          },
          required: ["name", "dosage", "frequency", "reminderTime"]
        }
      }
    });

    return JSON.parse(response.text || '{}');
  } catch (error) {
    console.error("Prescription Parsing Error:", error);
    throw error;
  }
};
