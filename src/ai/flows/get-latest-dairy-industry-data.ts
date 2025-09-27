
'use server';
/**
 * @fileOverview A Genkit flow to fetch the latest data about the Indian Dairy Industry.
 *
 * This flow dynamically fetches up-to-date information, ensuring the content
 * in the "Dairy Industry Insights" modal is always current.
 *
 * - getLatestDairyIndustryData - Fetches and structures the latest industry data.
 * - DairyIndustryDataSchema - The Zod schema for the output data structure.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const DairyIndustryDataSchema = z.object({
  overview: z.array(z.string()).describe('A list of key overview points about the Indian dairy industry. Include the latest statistics on milk production, market size, and growth rate.'),
  milestones: z.array(z.string()).describe('Key milestones of Operation Flood and the White Revolution.'),
  cooperatives: z.string().describe('The role of major dairy cooperatives like AMUL.'),
  trends: z.string().describe('New trends, including e-commerce, B2C startups, and new product types.'),
  exports: z.array(z.string()).describe('The latest dairy export status, including total volume, value, major products, and destinations.'),
  challenges: z.array(z.string()).describe('A list of current challenges facing the industry.'),
  opportunities: z.array(z.string()).describe('A list of current opportunities for growth in the industry.'),
  lastUpdated: z.string().describe('The date the information was last updated, in the format "DD MMMM YYYY".'),
});

export type DairyIndustryData = z.infer<typeof DairyIndustryDataSchema>;

export async function getLatestDairyIndustryData(): Promise<DairyIndustryData> {
  return getLatestDairyIndustryDataFlow();
}

const prompt = ai.definePrompt({
  name: 'getLatestDairyIndustryDataPrompt',
  output: { schema: DairyIndustryDataSchema },
  prompt: `You are a dairy industry analyst. Your task is to provide the most up-to-date and comprehensive information about the Indian Dairy Industry as of July 29, 2025.
Search for the latest available data and projections to provide a forward-looking analysis. Provide all information in Hinglish.
Format numbers and statistics clearly. For example, use "INR 20,000 billion" or "250 million tonnes".
Structure the output according to the provided schema. For all lists, provide at least 3-5 detailed bullet points.
Highlight key statistics and names by wrapping them in <strong> tags. For example: <strong>250 million tonnes</strong> or <strong>Amul</strong>.
Set the 'lastUpdated' field to '29 July 2025'.
Provide deep, insightful, and scientific information for all fields.
`,
});

const getLatestDairyIndustryDataFlow = ai.defineFlow(
  {
    name: 'getLatestDairyIndustryDataFlow',
    outputSchema: DairyIndustryDataSchema,
  },
  async () => {
    const { output } = await prompt();
    return output!;
  }
);