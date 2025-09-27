import { config } from 'dotenv';
config();

import '@/ai/flows/generate-adulterant-detection-instructions.ts';
import '@/ai/flows/generate-dairy-tip.ts';
import '@/ai/flows/suggest-dairy-recipes.ts';
import '@/ai/flows/get-latest-dairy-industry-data.ts';
import '@/ai/flows/expert-support-flow.ts';
import '@/ai/flows/gyan-ai-flow.ts';
import '@/ai/flows/refine-question-flow.ts';
import '@/ai/flows/text-to-speech-flow.ts';
import '@/ai/flows/interview-prepper-flow.ts';