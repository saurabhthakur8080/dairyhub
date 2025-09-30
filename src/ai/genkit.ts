
import {genkit} from 'genkit';
import {googleAI} from '@genkit-ai/googleai';

const geminiApiKey = process.env.GEMINI_API_KEY;
if (!geminiApiKey) {
  console.warn(
    'GEMINI_API_KEY is not set. AI features will not work. See README.md for instructions.'
  );
}

export const ai = genkit({
  plugins: [
    googleAI({
      apiKey: geminiApiKey,
      apiVersion: 'v1', // <-- Ye line add karein
    }),
  ],
  model: 'googleai/gemini-1.5-flash',
});
