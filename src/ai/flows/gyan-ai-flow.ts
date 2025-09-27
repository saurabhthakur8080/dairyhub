
'use server';
/**
 * @fileOverview A flow to generate an expert response for a given topic and question.
 */

import { ai } from '@/ai/genkit';
import { GyanAIInputSchema, GyanAIOutputSchema, type GyanAIInput } from './types';


const gyanAIPrompt = ai.definePrompt({
    name: 'gyanAIPrompt',
    input: { schema: GyanAIInputSchema },
    output: { schema: GyanAIOutputSchema },
    system: `Act as a PhD-level expert in {{topic}}. Provide a scientifically valid, professional, and well-structured answer in {{language}} for the user's question.
    Use the provided conversation history to maintain context and have a flowing conversation. Refer back to what was said before. Do not start every answer as if it's a new conversation.`,
    prompt: `{{#if history}}
    **Conversation History:**
    {{#each history}}
        **{{role}}:** {{#if content.[0].text}}{{content.[0].text}}{{/if}}
    {{/each}}
    {{/if}}
    
    User's question is: "{{question}}"`
});

const gyanAIFlow = ai.defineFlow(
    {
        name: 'gyanAIFlow',
        inputSchema: GyanAIInputSchema,
        outputSchema: GyanAIOutputSchema,
    },
    async (input) => {
        const { history, ...restOfInput } = input;
        
        const { output } = await gyanAIPrompt(
            restOfInput,
            { history: history || [] }
        );

        return output!;
    }
);


export async function gyanAI(input: GyanAIInput) {
  return gyanAIFlow(input);
}