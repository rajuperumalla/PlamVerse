
'use server';
/**
 * @fileOverview Refines a palm reading report based on admin feedback.
 *
 * - refinePalmReadingReport - A function that takes an original report and admin suggestions to produce a refined report.
 * - RefinePalmReadingReportInput - The input type for the function.
 * - RefinePalmReadingReportOutput - The return type for the function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const RefinePalmReadingReportInputSchema = z.object({
  originalReport: z.string().describe('The original AI-generated palm reading report.'),
  adminSuggestions: z.string().describe('Suggestions and corrections provided by an admin/expert to improve the report. This could include missed points, tone adjustments, or factual corrections.'),
});
export type RefinePalmReadingReportInput = z.infer<typeof RefinePalmReadingReportInputSchema>;

const RefinePalmReadingReportOutputSchema = z.object({
  refinedReport: z.string().describe('The palm reading report after incorporating admin suggestions.'),
});
export type RefinePalmReadingReportOutput = z.infer<typeof RefinePalmReadingReportOutputSchema>;

export async function refinePalmReadingReport(input: RefinePalmReadingReportInput): Promise<RefinePalmReadingReportOutput> {
  return refinePalmReadingReportFlow(input);
}

const prompt = ai.definePrompt({
  name: 'refinePalmReadingReportPrompt',
  input: {schema: RefinePalmReadingReportInputSchema},
  output: {schema: RefinePalmReadingReportOutputSchema},
  prompt: `You are an AI assistant tasked with refining a palm reading report based on expert admin feedback.
The goal is to improve the accuracy, insightfulness, and overall quality of the report, making it ready for the end-user.

Original AI-Generated Report:
\`\`\`
{{{originalReport}}}
\`\`\`

Admin Suggestions for Refinement:
\`\`\`
{{{adminSuggestions}}}
\`\`\`

Please carefully review the original report and the admin's suggestions.
Rewrite the report to incorporate all feedback.
Ensure the refined report is coherent, maintains a professional and empathetic tone suitable for a palm reading, and directly addresses the user.
If the suggestions are minor, integrate them smoothly. If they are substantial, rewrite sections as needed while preserving the core palmistry insights from both the original report and the admin's input.
The final output should be only the full text of the refined report, ready to be presented to the user. Do not include any conversational preamble or postamble, just the report itself.
`,
});

const refinePalmReadingReportFlow = ai.defineFlow(
  {
    name: 'refinePalmReadingReportFlow',
    inputSchema: RefinePalmReadingReportInputSchema,
    outputSchema: RefinePalmReadingReportOutputSchema,
  },
  async (input) => {
    const {output} = await prompt(input);
    if (!output) {
      throw new Error("The AI model did not return a valid output. Please try again.");
    }
    return output;
  }
);
