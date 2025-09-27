
'use server';
/**
 * @fileOverview This file defines a Genkit flow for generating a daily dairy tip.
 *
 * It exports:
 * - `generateDairyTip`: An async function to generate a new daily dairy tip.
 * - `DairyTipInput`: The input type for the generateDairyTip function (empty).
 * - `DairyTipOutput`: The output type for the generateDairyTip function (string).
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';

// Zod schemas for input and output validation
const DairyTipInputSchema = z.object({});
const DairyTipOutputSchema = z.string();
export type DairyTipOutput = z.infer<typeof DairyTipOutputSchema>;

/**
 * Main function to generate a random dairy tip.
 */
export async function generateDairyTip(): Promise<DairyTipOutput> {
  return generateDairyTipFlow({});
}

/**
 * The AI flow that defines the logic for generating the tip.
 */
const generateDairyTipFlow = ai.defineFlow(
  {
    name: 'generateDairyTipFlow',
    inputSchema: DairyTipInputSchema,
    outputSchema: DairyTipOutputSchema,
  },
  async () => {
    // 1. Define all possible topics in an array.
    const topics = [
      'Dairy Processing (like Pasteurization or Homogenization)',
      'A specific Dairy Product (like Paneer, Cheese, Ghee, or Ice Cream)',
      'Milk Chemistry (like Fat, Protein, or Lactose)',
      'Quality Assurance in Dairy (like HACCP or ISO 22000)',
      'Quality Control in Dairy (like SOPs or PRPs)',
      'Indian Standards for a dairy product (FSSAI or BIS)',
      'Food Preservation principles in dairy',
      'A common milk Adulterant and its detection',
      'New R&D or Technology in the Dairy sector'
    ];

    // 2. Randomly select one topic for this run.
    const selectedTopic = topics[Math.floor(Math.random() * topics.length)];

    // 3. Generate the AI response using a dynamic prompt.
    const { text } = await ai.generate({
      prompt: `You are an expert dairy and food technologist. Your task is to generate a detailed, insightful, and scientific "Did you know?" style tip.

The topic for today's tip is: **${selectedTopic}**.

Please generate a deep, long-form answer with scientific backing related to this specific topic. Do not choose any other topic.

The response MUST be in Hinglish (a mix of Hindi and English).
The tone should be educational yet easy for a common person to understand.

Example of a good, detailed response (if the topic was Homogenization):
"**Homogenization ka scientific raaz kya hai?** Homogenization ek mechanical process hai jisme doodh ko high pressure (lagbhag 2000-3000 PSI) par ek chote se gap (homogenizer valve) se force kiya jaata hai. Isse doodh ke bade fat globules (3-6 microns) toot kar 2 micron se bhi chote ho jaate hain. Is process se fat globules ka surface area badh jaata hai, aur un par ek nayi membrane ban jaati hai jisme casein aur whey proteins hote hain. Yeh nayi membrane fat globules ko aapas mein judne se rokti hai, jisse doodh par malai ki layer nahi banti. Isliye homogenized doodh ka texture zyada creamy aur taste rich lagta hai."

Now, generate a new, different, and equally detailed scientific tip about **${selectedTopic}**.`,
    });

    // 4. Return the generated text or a default fallback message.
    return text ?? "Doodh se judi ek rochak jankari! Aaj ka topic thoda alag hai, jiske baare me hum agli baar baat karenge.";
  }
);