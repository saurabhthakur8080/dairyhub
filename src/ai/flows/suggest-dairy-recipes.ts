
'use server';

/**
 * @fileOverview Provides recipe suggestions based on the final milk composition.
 */

import {ai} from '@/ai/genkit';
import { SuggestDairyRecipesInputSchema, SuggestDairyRecipesOutputSchema, type SuggestDairyRecipesInput } from './types';


const prompt = ai.definePrompt({
  name: 'suggestDairyRecipesPrompt',
  input: {schema: SuggestDairyRecipesInputSchema},
  output: {schema: SuggestDairyRecipesOutputSchema},
  prompt: `Suggest 2 simple recipes I can make with {{milkType}} that has {{fatPercentage}}% fat and {{snfPercentage}}% SNF. Provide the recipes in a simple, easy-to-follow format with ingredients and steps. Respond in Hinglish.`,
  config: {
    safetySettings: [
      {
        category: 'HARM_CATEGORY_DANGEROUS_CONTENT',
        threshold: 'BLOCK_ONLY_HIGH',
      },
      {
        category: 'HARM_CATEGORY_HATE_SPEECH',
        threshold: 'BLOCK_ONLY_HIGH',
      },
    ],
  },
});

const suggestDairyRecipesFlow = ai.defineFlow(
  {
    name: 'suggestDairyRecipesFlow',
    inputSchema: SuggestDairyRecipesInputSchema,
    outputSchema: SuggestDairyRecipesOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return {recipeSuggestions: output!.recipeSuggestions!};
  }
);


export async function suggestDairyRecipes(input: SuggestDairyRecipesInput) {
  return suggestDairyRecipesFlow(input);
}