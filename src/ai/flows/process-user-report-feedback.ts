
'use server';
/**
 * @fileOverview Processes user feedback on a palm reading report.
 *
 * - processUserReportFeedback - A function that takes user feedback and the original report, and returns an acknowledgment.
 * - ProcessUserReportFeedbackInput - The input type for the function.
 * - ProcessUserReportFeedbackOutput - The return type for the function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ProcessUserReportFeedbackInputSchema = z.object({
  originalReport: z.string().describe('The original palm reading report text.'),
  userFeedback: z.string().describe('The feedback provided by the user regarding the report.'),
});
export type ProcessUserReportFeedbackInput = z.infer<typeof ProcessUserReportFeedbackInputSchema>;

const ProcessUserReportFeedbackOutputSchema = z.object({
  acknowledgment: z.string().describe('An acknowledgment message to the user for their feedback.'),
});
export type ProcessUserReportFeedbackOutput = z.infer<typeof ProcessUserReportFeedbackOutputSchema>;

export async function processUserReportFeedback(input: ProcessUserReportFeedbackInput): Promise<ProcessUserReportFeedbackOutput> {
  return processUserReportFeedbackFlow(input);
}

const prompt = ai.definePrompt({
  name: 'processUserReportFeedbackPrompt',
  input: {schema: ProcessUserReportFeedbackInputSchema},
  output: {schema: ProcessUserReportFeedbackOutputSchema},
  prompt: `You are a helpful assistant for a palm reading application.
A user has provided feedback on a palm reading report they received.
Your task is to acknowledge their feedback politely and inform them that it will be considered for future improvements.

Original Report Snippet (for context, may not be complete):
\`\`\`
{{{originalReport}}}
\`\`\`

User Feedback:
\`\`\`
{{{userFeedback}}}
\`\`\`

Generate a brief, friendly acknowledgment message for the user. For example: "Thank you for your feedback! We appreciate you taking the time to help us improve our palm readings."
Do not try to re-analyze the palm or directly address the specifics of their feedback in your acknowledgment. Just provide a polite acknowledgment.
`,
});

const processUserReportFeedbackFlow = ai.defineFlow(
  {
    name: 'processUserReportFeedbackFlow',
    inputSchema: ProcessUserReportFeedbackInputSchema,
    outputSchema: ProcessUserReportFeedbackOutputSchema,
  },
  async (input) => {
    // For more complex scenarios, you might store the feedback in a database here,
    // or trigger other actions. For now, we just process it with the LLM for acknowledgment.
    const {output} = await prompt(input);
    if (!output) {
      throw new Error("The AI model did not return a valid output. Please try again.");
    }
    return output;
  }
);
