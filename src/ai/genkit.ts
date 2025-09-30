import { genkit } from 'genkit';
import { googleAI } from '@genkit-ai/googleai';

const geminiApiKey = process.env.GEMINI_API_KEY;
if (!geminiApiKey) {
  console.warn(
    'GEMINI_API_KEY is not set. AI features will not work.'
  );
}

export const ai = genkit({
  plugins: [
    googleAI({
      apiKey: geminiApiKey,
      apiVersion: 'v1', // <<< YEH LINE SABSE ZYADA ZAROORI HAI
    }),
  ],
  model: 'googleai/gemini-1.5-flash',
  logLevel: 'debug', // Yeh extra logs ke liye hai
  enableTracingAndMetrics: true,
});