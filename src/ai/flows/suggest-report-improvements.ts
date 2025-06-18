'use server';

/**
 * @fileOverview Suggests improvements to the initial draft of the palm reading report using GenAI.
 *
 * - suggestReportImprovements - A function that suggests improvements to the palm reading report.
 * - SuggestReportImprovementsInput - The input type for the suggestReportImprovements function.
 * - SuggestReportImprovementsOutput - The return type for the suggestReportImprovements function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestReportImprovementsInputSchema = z.object({
  report: z.string().describe('The initial draft of the palm reading report.'),
});
export type SuggestReportImprovementsInput = z.infer<typeof SuggestReportImprovementsInputSchema>;

const SuggestReportImprovementsOutputSchema = z.object({
  suggestions: z.string().describe('Suggested improvements for the palm reading report.'),
});
export type SuggestReportImprovementsOutput = z.infer<typeof SuggestReportImprovementsOutputSchema>;

export async function suggestReportImprovements(input: SuggestReportImprovementsInput): Promise<SuggestReportImprovementsOutput> {
  return suggestReportImprovementsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestReportImprovementsPrompt',
  input: {schema: SuggestReportImprovementsInputSchema},
  output: {schema: SuggestReportImprovementsOutputSchema},
  prompt: `You are an expert palmistry report editor.

You will be provided with an initial draft of a palm reading report. Your task is to suggest improvements to the report to make it more accurate, insightful, and helpful to the user. Consider clarity, depth, and overall quality of the analysis. The suggested improvements should be concise and actionable.

Report:
{{report}}`,
});

const suggestReportImprovementsFlow = ai.defineFlow(
  {
    name: 'suggestReportImprovementsFlow',
    inputSchema: SuggestReportImprovementsInputSchema,
    outputSchema: SuggestReportImprovementsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
