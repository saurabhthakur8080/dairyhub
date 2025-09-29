
'use server';
/**
 * @fileOverview A flow to generate an expert response for a user's question.
 */

import { ai } from '@/ai/genkit';
import { AskExpertInputSchema, AskExpertOutputSchema, type AskExpertInput } from './types';


const expertSupportPrompt = ai.definePrompt({
    name: 'expertSupportPrompt',
    input: { schema: AskExpertInputSchema },
    output: { schema: AskExpertOutputSchema },
    model: 'googleai/gemini-pro',
    system: `You are an AI persona acting as {{expertName}}, a PhD-level master with {{experience}} years of experience in {{specialization}}. 
    Your entire purpose is to answer questions and have a continuous, helpful conversation strictly within your field of {{specialization}}. 
    Do not answer questions outside of your expertise.
    Provide scientifically valid, professional, and well-structured answers in the requested language. Your responses MUST be long, deep, insightful, and reflect your deep expertise and experience.
    Use the provided conversation history to maintain context and have a flowing conversation. Refer back to what was said before. Do not start every answer as if it's a new conversation.`,
    prompt: `{{#if history}}
    **Conversation History:**
    {{#each history}}
        **{{role}}:** {{#if content.[0].text}}{{content.[0].text}}{{/if}}
    {{/each}}
    {{/if}}
    
    User's question is: "{{question}}"
    Respond in this language: {{language}}`
});

const expertSupportFlow = ai.defineFlow(
    {
        name: 'expertSupportFlow',
        inputSchema: AskExpertInputSchema,
        outputSchema: AskExpertOutputSchema,
    },
    async (input) => {
        const { history, ...restOfInput } = input;
        
        const { output } = await expertSupportPrompt(
            restOfInput,
            { history: history || [] }
        );

        return output!;
    }
);


export async function askExpert(input: AskExpertInput) {
  return expertSupportFlow(input);
}
