
'use server';

/**
 * @fileOverview A palm reading AI agent.
 *
 * - generatePalmReading - A function that handles the palm reading generation process.
 * - GeneratePalmReadingInput - The input type for the generatePalmReading function.
 * - GeneratePalmReadingOutput - The return type for the generatePalmReading function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GeneratePalmReadingInputSchema = z.object({
  leftPalmDataUri: z
    .string()
    .describe(
      "A photo of the left palm, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
  rightPalmDataUri: z
    .string()
    .describe(
      "A photo of the right palm, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
  dateOfBirth: z.string().describe('The date of birth of the user.'),
  placeOfBirth: z.string().describe('The place of birth of the user.'),
  timeOfBirth: z.string().describe('The time of birth of the user.'),
  dominantHand: z.string().describe('The dominant hand of the user.'),
  category: z.string().describe('The category for the palm reading report: General Personality, Health and Wellness, Love and relationships, Career and Finances,etc.'),
  expertAnalysis: z.string().optional().describe('Detailed analysis and interpretation notes provided by a human expert. This should guide the AI generation if present.'),
});
export type GeneratePalmReadingInput = z.infer<typeof GeneratePalmReadingInputSchema>;

const GeneratePalmReadingOutputSchema = z.object({
  report: z.string().describe('The generated palm reading report.'),
});
export type GeneratePalmReadingOutput = z.infer<typeof GeneratePalmReadingOutputSchema>;

export async function generatePalmReading(input: GeneratePalmReadingInput): Promise<GeneratePalmReadingOutput> {
  return generatePalmReadingFlow(input);
}

// This prompt is defined but NOT USED for the dummy data logic below.
// It's kept for when actual AI generation is implemented.
const prompt = ai.definePrompt({
  name: 'generatePalmReadingPrompt',
  input: {schema: GeneratePalmReadingInputSchema},
  output: {schema: GeneratePalmReadingOutputSchema},
  prompt: `You are an expert palm reader.
  {{#if expertAnalysis}}
  A human expert palm reader has provided the following analysis and directives. Use this as the PRIMARY basis for your report. Integrate the user's details and palm images as supporting information or for aspects not explicitly covered by the expert.

  Expert Analysis & Directives:
  {{{expertAnalysis}}}

  User Details for context:
  Left Palm: {{media url=leftPalmDataUri}}
  Right Palm: {{media url=rightPalmDataUri}}
  Date of Birth: {{{dateOfBirth}}}
  Place of Birth: {{{placeOfBirth}}}
  Time of Birth: {{{timeOfBirth}}}
  Dominant Hand: {{{dominantHand}}}
  Category: {{{category}}}

  Generate a comprehensive palm reading report based PRIMARILY on the expert's analysis. Ensure it aligns with the specified category and incorporates the user's details where relevant and not contradictory to the expert's input. The final report should be well-structured, insightful, and directly address the user.
  {{else}}
  Analyze the user's palms and provide a detailed report based on the information provided.

  Left Palm: {{media url=leftPalmDataUri}}
  Right Palm: {{media url=rightPalmDataUri}}
  Date of Birth: {{{dateOfBirth}}}
  Place of Birth: {{{placeOfBirth}}}
  Time of Birth: {{{timeOfBirth}}}
  Dominant Hand: {{{dominantHand}}}
  Category: {{{category}}}

  Based on the palm images and the provided information, generate a comprehensive palm reading report, focusing on the specified category. The report should be detailed and insightful.
  {{/if}}
  `,
});

const generatePalmReadingFlow = ai.defineFlow(
  {
    name: 'generatePalmReadingFlow',
    inputSchema: GeneratePalmReadingInputSchema,
    outputSchema: GeneratePalmReadingOutputSchema,
  },
  async input => {
    // Simulate extremely simple dummy content to isolate potential issues.
    const dummyReport = `This is a very simple simulated report for category: ${input.category}. If you see this, the flow structure is working.`;
    return { report: dummyReport }; 
  }
);
