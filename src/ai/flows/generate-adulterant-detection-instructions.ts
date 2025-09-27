
'use server';
/**
 * @fileOverview A flow to generate instructions for detecting milk adulterants and preservatives.
 */

import {ai} from '@/ai/genkit';
import { GenerateAdulterantDetectionInstructionsInputSchema, GenerateAdulterantDetectionInstructionsOutputSchema, type GenerateAdulterantDetectionInstructionsInput } from './types';

const generateAdulterantDetectionInstructionsFlow = ai.defineFlow(
  {
    name: 'generateAdulterantDetectionInstructionsFlow',
    inputSchema: GenerateAdulterantDetectionInstructionsInputSchema,
    outputSchema: GenerateAdulterantDetectionInstructionsOutputSchema,
  },
  async input => {
    const prompt = ai.definePrompt({
      name: 'generateAdulterantDetectionInstructionsPrompt',
      input: {schema: GenerateAdulterantDetectionInstructionsInputSchema},
      output: {schema: GenerateAdulterantDetectionInstructionsOutputSchema},
      prompt: `You are an expert in dairy science, skilled at explaining complex chemical tests in simple terms.

The user wants to know how to detect a specific adulterant or preservative in milk. Provide clear, step-by-step instructions that are easy to follow, even for someone without a scientific background. Be sure to use Hinglish, mixing Hindi and English words.

Adulterant/Preservative: {{{adulterant}}}

Instructions:`,
    });
    const {output} = await prompt(input);
    return output!;
  }
);

export async function generateAdulterantDetectionInstructions(
  input: GenerateAdulterantDetectionInstructionsInput
) {
    return generateAdulterantDetectionInstructionsFlow(input);
}