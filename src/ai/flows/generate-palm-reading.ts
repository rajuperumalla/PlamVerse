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
});
export type GeneratePalmReadingInput = z.infer<typeof GeneratePalmReadingInputSchema>;

const GeneratePalmReadingOutputSchema = z.object({
  report: z.string().describe('The generated palm reading report.'),
});
export type GeneratePalmReadingOutput = z.infer<typeof GeneratePalmReadingOutputSchema>;

export async function generatePalmReading(input: GeneratePalmReadingInput): Promise<GeneratePalmReadingOutput> {
  return generatePalmReadingFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generatePalmReadingPrompt',
  input: {schema: GeneratePalmReadingInputSchema},
  output: {schema: GeneratePalmReadingOutputSchema},
  prompt: `You are an expert palm reader. Analyze the user's palms and provide a detailed report based on the information provided.

  Left Palm: {{media url=leftPalmDataUri}}
  Right Palm: {{media url=rightPalmDataUri}}
  Date of Birth: {{{dateOfBirth}}}
  Place of Birth: {{{placeOfBirth}}}
  Time of Birth: {{{timeOfBirth}}}
  Dominant Hand: {{{dominantHand}}}
  Category: {{{category}}}

  Based on the palm images and the provided information, generate a comprehensive palm reading report, focusing on the specified category. The report should be detailed and insightful.
  `,
});

const generatePalmReadingFlow = ai.defineFlow(
  {
    name: 'generatePalmReadingFlow',
    inputSchema: GeneratePalmReadingInputSchema,
    outputSchema: GeneratePalmReadingOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
