
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
  frontPalmDataUri: z
    .string()
    .describe(
      "A photo of the front of the user's dominant palm, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
  sidePalmDataUri: z
    .string()
    .describe(
      "A photo of the side of the user's dominant palm, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
  dateOfBirth: z.string().describe('The date of birth of the user.'),
  placeOfBirth: z.string().describe('The place of birth of the user.'),
  latitude: z.string().optional().describe('The latitude of the place of birth.'),
  longitude: z.string().optional().describe('The longitude of the place of birth.'),
  timeOfBirth: z.string().describe('The time of birth of the user. Can be "Not specified".'),
  dominantHand: z.string().describe('The dominant hand of the user.'),
  category: z.string().describe('The category for the palm reading report: General Personality, Career & Finance, Health & Wellness, Marriage & Relationships, Comprehensive Analysis.'),
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

const prompt = ai.definePrompt({
  name: 'generatePalmReadingPrompt',
  input: {schema: GeneratePalmReadingInputSchema},
  output: {schema: GeneratePalmReadingOutputSchema},
  prompt: `You are an expert in both Vedic Astrology and Palmistry. Your task is to provide an integrated Palm-Astro Correlation report.

You must analyze the user's palm images and their astrological details (Date of Birth, Time of Birth, Place of Birth) to create a comprehensive analysis. Correlate the findings from the palm lines (Life, Head, Heart, Fate, etc.) with planetary positions, dasha/antardasha cycles, and overall astrological influences from their birth chart.

The user has provided a front and a side view of their dominant hand. Pay special attention to the side view for analyzing lines related to relationships and children.

{{#if expertAnalysis}}
A human expert has provided the following analysis and directives. Use this as the PRIMARY basis for your report. Your role is to expand on the expert's notes, providing detailed explanations and ensuring the palmistry and astrological correlations are clear and well-integrated.

Expert Analysis & Directives:
{{{expertAnalysis}}}

User Details for context:
Front of Dominant Palm: {{media url=frontPalmDataUri}}
Side of Dominant Palm: {{media url=sidePalmDataUri}}
Date of Birth: {{{dateOfBirth}}}
Time of Birth: {{{timeOfBirth}}}
Place of Birth: {{{placeOfBirth}}} (Lat: {{latitude}}, Lon: {{longitude}})
Dominant Hand: {{{dominantHand}}}
Category: {{{category}}}

Generate a comprehensive Palm-Astro Correlation report based PRIMARILY on the expert's analysis. Ensure it aligns with the specified category and incorporates the user's details where relevant and not contradictory to the expert's input. The final report should be well-structured, insightful, and directly address the user.
{{else}}
Analyze the user's dominant palm and their birth details to provide a detailed Palm-Astro Correlation report.

Front of Dominant Palm: {{media url=frontPalmDataUri}}
Side of Dominant Palm: {{media url=sidePalmDataUri}}
Date of Birth: {{{dateOfBirth}}}
Time of Birth: {{{timeOfBirth}}}
Place of Birth: {{{placeOfBirth}}} (Lat: {{latitude}}, Lon: {{longitude}})
Dominant Hand: {{{dominantHand}}}
Category: {{{category}}}

Based on the palm images and the provided birth information, generate a comprehensive report focusing on the specified category.
1.  Analyze the major palm lines (Life, Head, Heart, Fate) and mounts.
2.  Correlate these palmistry findings with the user's astrological chart based on their birth data. Discuss how planetary strengths/weaknesses or current dasha periods might be reflected in the palm lines.
3.  The report should be detailed, insightful, and blend both disciplines seamlessly.
{{/if}}
  `,
});

const generatePalmReadingFlow = ai.defineFlow(
  {
    name: 'generatePalmReadingFlow',
    inputSchema: GeneratePalmReadingInputSchema,
    outputSchema: GeneratePalmReadingOutputSchema,
  },
  async (input) => {
    const {output} = await prompt(input);
    if (!output) {
      throw new Error("The AI model did not return a valid output. Please try again.");
    }
    return output;
  }
);
