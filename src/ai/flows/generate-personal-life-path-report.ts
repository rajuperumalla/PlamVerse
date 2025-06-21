
'use server';
/**
 * @fileOverview Generates a personal life path and destiny numerology report.
 *
 * - generatePersonalLifePathReport - A function that handles the report generation.
 * - GeneratePersonalLifePathInput - The input type for the function.
 * - GeneratePersonalLifePathOutput - The return type for the function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GeneratePersonalLifePathInputSchema = z.object({
  fullName: z.string().describe("The full name of the individual (as per official documents)."),
  dateOfBirth: z.string().describe("The date of birth of the individual (YYYY-MM-DD)."),
  timeOfBirth: z.string().optional().describe("The time of birth of the individual (HH:MM), if known. This can add more depth to the reading."),
  expertAnalysis: z.string().optional().describe('Detailed analysis and interpretation notes provided by a human expert numerologist. This should guide the AI generation if present.'),
});
export type GeneratePersonalLifePathInput = z.infer<typeof GeneratePersonalLifePathInputSchema>;

const GeneratePersonalLifePathOutputSchema = z.object({
  report: z.string().describe('The generated personal life path and destiny numerology report.'),
});
export type GeneratePersonalLifePathOutput = z.infer<typeof GeneratePersonalLifePathOutputSchema>;

export async function generatePersonalLifePathReport(input: GeneratePersonalLifePathInput): Promise<GeneratePersonalLifePathOutput> {
  return generatePersonalLifePathReportFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generatePersonalLifePathPrompt',
  input: {schema: GeneratePersonalLifePathInputSchema},
  output: {schema: GeneratePersonalLifePathOutputSchema},
  prompt: `You are an expert numerologist specializing in personal life path and destiny reports.
  {{#if expertAnalysis}}
  A human expert numerologist has provided the following analysis and directives. Use this as the PRIMARY basis for your report. Integrate the individual's details as supporting information.

  Expert Numerology Analysis & Directives:
  {{{expertAnalysis}}}

  Individual's Details for context:
  Full Name: {{{fullName}}}
  Date of Birth: {{{dateOfBirth}}}
  {{#if timeOfBirth}}Time of Birth: {{{timeOfBirth}}}{{/if}}

  Generate a comprehensive personal life path and destiny report based PRIMARILY on the expert's analysis. Ensure it aligns with numerological principles, revealing life purpose, strengths, challenges, and career alignment.
  {{else}}
  Analyze the provided individual details to generate a personal life path and destiny report.

  Full Name: {{{fullName}}}
  Date of Birth: {{{dateOfBirth}}}
  {{#if timeOfBirth}}Time of Birth: {{{timeOfBirth}}}{{/if}}

  Based on these details, generate a comprehensive personal life path and destiny report. Calculate and interpret key numerological numbers such as Life Path, Destiny (Expression), Soul Urge (Heart's Desire), and Personality numbers.
  Explain their significance in relation to the individual's life purpose, inherent strengths, potential weaknesses or challenges, compatibility with others, and suitable career paths or areas of talent.
  If time of birth is provided, incorporate any additional insights it might offer (e.g., Ascendant influence in some numerological systems).
  The report should be detailed, insightful, encouraging, and professionally toned.
  {{/if}}
  `,
});

const generatePersonalLifePathReportFlow = ai.defineFlow(
  {
    name: 'generatePersonalLifePathReportFlow',
    inputSchema: GeneratePersonalLifePathInputSchema,
    outputSchema: GeneratePersonalLifePathOutputSchema,
  },
  async (input) => {
    const {output} = await prompt(input);
    if (!output) {
      throw new Error("The AI model did not return a valid output. Please try again.");
    }
    return output;
  }
);

