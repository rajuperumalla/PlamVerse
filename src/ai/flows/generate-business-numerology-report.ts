'use server';
/**
 * @fileOverview Generates a business numerology report.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateBusinessNumerologyInputSchema = z.object({
  businessName: z.string().describe("The primary name of the business."),
  additionalBusinessNames: z.string().optional().describe("Other considered business names."),
  founderFullName: z.string().describe("The full name of the founder."),
  founderDOB: z.string().describe("The date of birth of the founder (YYYY-MM-DD)."),
  founderTOB: z.string().optional().describe("The time of birth of the founder (HH:MM), if known."),
  expertAnalysis: z.string().optional().describe('Detailed analysis and interpretation notes provided by a human expert numerologist. This should guide the AI generation if present.'),
});
export type GenerateBusinessNumerologyInput = z.infer<typeof GenerateBusinessNumerologyInputSchema>;

const GenerateBusinessNumerologyOutputSchema = z.object({
  report: z.string().describe('The generated business numerology report.'),
});
export type GenerateBusinessNumerologyOutput = z.infer<typeof GenerateBusinessNumerologyOutputSchema>;

export async function generateBusinessNumerologyReport(input: GenerateBusinessNumerologyInput): Promise<GenerateBusinessNumerologyOutput> {
  return generateBusinessNumerologyReportFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateBusinessNumerologyPrompt',
  input: {schema: GenerateBusinessNumerologyInputSchema},
  output: {schema: GenerateBusinessNumerologyOutputSchema},
  prompt: `You are an expert numerologist specializing in business and corporate analysis.
  {{#if expertAnalysis}}
  A human expert numerologist has provided the following analysis and directives. Use this as the PRIMARY basis for your report.
  Expert Numerology Analysis & Directives:
  {{{expertAnalysis}}}

  Business Name: {{{businessName}}}
  Founder: {{{founderFullName}}} (DOB: {{{founderDOB}}})
  
  Generate a comprehensive business numerology report based PRIMARILY on the expert's analysis.
  {{else}}
  Analyze the provided business details to generate a business numerology report.
  
  Business Name: {{{businessName}}}
  Founder: {{{founderFullName}}} (DOB: {{{founderDOB}}})
  
  Based on these details, generate a comprehensive business numerology report evaluating the harmony between the business name and the founder.
  {{/if}}
  `,
});

const generateBusinessNumerologyReportFlow = ai.defineFlow(
  {
    name: 'generateBusinessNumerologyReportFlow',
    inputSchema: GenerateBusinessNumerologyInputSchema,
    outputSchema: GenerateBusinessNumerologyOutputSchema,
  },
  async (input) => {
    const {output} = await prompt(input);
    if (!output) {
      throw new Error("The AI model did not return a valid output. Please try again.");
    }
    return output;
  }
);