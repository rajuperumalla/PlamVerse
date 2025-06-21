
'use server';
/**
 * @fileOverview Generates a business numerology report.
 *
 * - generateBusinessNumerologyReport - A function that handles the report generation.
 * - GenerateBusinessNumerologyInput - The input type for the function.
 * - GenerateBusinessNumerologyOutput - The return type for the function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateBusinessNumerologyInputSchema = z.object({
  businessName: z.string().describe('The primary name of the business.'),
  additionalBusinessNames: z.string().optional().describe('Alternative business names or variations, if any.'),
  founderFullName: z.string().describe("The full name of the business founder or key person."),
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
  prompt: `You are an expert numerologist specializing in business name analysis.
  {{#if expertAnalysis}}
  A human expert numerologist has provided the following analysis and directives. Use this as the PRIMARY basis for your report. Integrate the business and founder details as supporting information.

  Expert Numerology Analysis & Directives:
  {{{expertAnalysis}}}

  Business & Founder Details for context:
  Business Name: {{{businessName}}}
  {{#if additionalBusinessNames}}Additional Names: {{{additionalBusinessNames}}}{{/if}}
  Founder's Full Name: {{{founderFullName}}}
  Founder's Date of Birth: {{{founderDOB}}}
  {{#if founderTOB}}Founder's Time of Birth: {{{founderTOB}}}{{/if}}

  Generate a comprehensive business numerology report based PRIMARILY on the expert's analysis. Ensure it aligns with numerological principles for business success, financial growth, and brand attraction.
  {{else}}
  Analyze the provided business and founder details to generate a business numerology report.

  Business Name: {{{businessName}}}
  {{#if additionalBusinessNames}}Additional Names: {{{additionalBusinessNames}}}{{/if}}
  Founder's Full Name: {{{founderFullName}}}
  Founder's Date of Birth: {{{founderDOB}}}
  {{#if founderTOB}}Founder's Time of Birth: {{{founderTOB}}}{{/if}}

  Based on these details, generate a comprehensive business numerology report. Focus on the numerological significance of the business name(s) in relation to the founder's core numbers. Provide insights on potential strengths, challenges, and overall vibration for success, financial growth, and brand attraction. The report should be detailed, insightful, and professionally toned.
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
