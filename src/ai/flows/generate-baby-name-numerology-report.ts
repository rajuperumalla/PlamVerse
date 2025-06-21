
'use server';
/**
 * @fileOverview Generates a baby name numerology report.
 *
 * - generateBabyNameNumerologyReport - A function that handles the report generation.
 * - GenerateBabyNameNumerologyInput - The input type for the function.
 * - GenerateBabyNameNumerologyOutput - The return type for the function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateBabyNameNumerologyInputSchema = z.object({
  proposedNames: z.array(z.string()).describe('A list of proposed names for the baby.'),
  childDOB: z.string().describe("The date of birth of the child (YYYY-MM-DD)."),
  childTOB: z.string().optional().describe("The time of birth of the child (HH:MM), if known."),
  parent1FullName: z.string().optional().describe("The full name of the first parent, if provided."),
  parent1DOB: z.string().optional().describe("The date of birth of the first parent (YYYY-MM-DD), if provided."),
  parent2FullName: z.string().optional().describe("The full name of the second parent, if applicable."),
  parent2DOB: z.string().optional().describe("The date of birth of the second parent (YYYY-MM-DD), if applicable."),
  expertAnalysis: z.string().optional().describe('Detailed analysis and interpretation notes provided by a human expert numerologist. This should guide the AI generation if present.'),
});
export type GenerateBabyNameNumerologyInput = z.infer<typeof GenerateBabyNameNumerologyInputSchema>;

const GenerateBabyNameNumerologyOutputSchema = z.object({
  report: z.string().describe('The generated baby name numerology report.'),
});
export type GenerateBabyNameNumerologyOutput = z.infer<typeof GenerateBabyNameNumerologyOutputSchema>;

export async function generateBabyNameNumerologyReport(input: GenerateBabyNameNumerologyInput): Promise<GenerateBabyNameNumerologyOutput> {
  return generateBabyNameNumerologyReportFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateBabyNameNumerologyPrompt',
  input: {schema: GenerateBabyNameNumerologyInputSchema},
  output: {schema: GenerateBabyNameNumerologyOutputSchema},
  prompt: `You are an expert numerologist specializing in baby name analysis.
  {{#if expertAnalysis}}
  A human expert numerologist has provided the following analysis and directives. Use this as the PRIMARY basis for your report. Integrate the child and parent details as supporting information.

  Expert Numerology Analysis & Directives:
  {{{expertAnalysis}}}

  Child & Parent Details for context:
  Proposed Names: {{#each proposedNames}}{{{this}}}{{#unless @last}}, {{/unless}}{{/each}}
  Child's Date of Birth: {{{childDOB}}}
  {{#if childTOB}}Child's Time of Birth: {{{childTOB}}}{{/if}}
  {{#if parent1FullName}}Parent 1: {{{parent1FullName}}} (DOB: {{{parent1DOB}}}){{/if}}
  {{#if parent2FullName}}Parent 2: {{{parent2FullName}}} (DOB: {{{parent2DOB}}}){{/if}}

  Generate a comprehensive baby name numerology report based PRIMARILY on the expert's analysis. Ensure it aligns with numerological principles for harmony, positive traits, and life path compatibility.
  {{else}}
  Analyze the provided child and parent details to generate a baby name numerology report.

  Proposed Names: {{#each proposedNames}}{{{this}}}{{#unless @last}}, {{/unless}}{{/each}}
  Child's Date of Birth: {{{childDOB}}}
  {{#if childTOB}}Child's Time of Birth: {{{childTOB}}}{{/if}}
  {{#if parent1FullName}}Parent 1: {{{parent1FullName}}} (DOB: {{{parent1DOB}}}){{/if}}
  {{#if parent2FullName}}Parent 2: {{{parent2FullName}}} (DOB: {{{parent2DOB}}}){{/if}}

  Based on these details, generate a comprehensive baby name numerology report. Analyze each proposed name. Focus on its numerological significance in relation to the child's core numbers (derived from DOB) and its compatibility with the parents' numerology if provided. Provide insights on potential strengths, challenges, and overall vibration for each name. Recommend the most harmonious name(s) if possible. The report should be detailed, insightful, and professionally toned.
  {{/if}}
  `,
});

const generateBabyNameNumerologyReportFlow = ai.defineFlow(
  {
    name: 'generateBabyNameNumerologyReportFlow',
    inputSchema: GenerateBabyNameNumerologyInputSchema,
    outputSchema: GenerateBabyNameNumerologyOutputSchema,
  },
  async (input) => {
    const {output} = await prompt(input);
    return output!;
  }
);
