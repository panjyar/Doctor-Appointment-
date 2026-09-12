import { GoogleGenerativeAI } from '@google/generative-ai';

export async function generateVisitSummary(reasonForVisit) {
  if (!process.env.GEMINI_API_KEY) {
    const error = new Error('AI summary is not configured. Add GEMINI_API_KEY to api/.env.');
    error.statusCode = 503;
    throw error;
  }

  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  const model = genAI.getGenerativeModel({
    model: process.env.GEMINI_MODEL || 'gemini-3.6-flash',
    systemInstruction: "Create a concise, neutral appointment intake summary from the patient-provided reason. Do not diagnose, prescribe, or add facts. Use one or two short sentences suitable for a clinic appointment list."
  });

  const response = await model.generateContent(`Reason for visit: ${reasonForVisit}`);

  const summary = response.response.text()?.trim();
  if (!summary) {
    const error = new Error('The AI service returned an empty summary.');
    error.statusCode = 502;
    throw error;
  }

  return summary;
}
