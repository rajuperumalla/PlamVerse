
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
  async (input) => {
    // Simulate a more detailed dummy report
    const dummyReport = `
## Palm Reading Report for Category: ${input.category}

**Introduction:**
This simulated palm reading offers insights based on the category of "${input.category}". Palmistry is an ancient art, and this report provides a generalized interpretation for demonstration purposes. Your dominant hand, the ${input.dominantHand} hand, primarily reflects your current life path and conscious actions, while your non-dominant hand reveals your innate potential and past influences.

**Key Observations (Simulated):**

**Life Line:**
Your Life Line appears to be well-defined and suggests a good level of vitality and enthusiasm for life. There are indications of significant life events that could shape your journey. Minor breaks or islands might represent periods of change or challenge, but overall, the line shows resilience.

**Head Line:**
The Head Line indicates your intellectual style and how you approach problems. A clear, long Head Line (simulated here) suggests a logical and analytical mind. If it were sloping, it might indicate creativity, while a straight line points to a more practical approach.

**Heart Line:**
Regarding "${input.category}", the Heart Line provides insights into your emotional nature and relationships. A curved Heart Line often signifies a warm and expressive individual. The length and depth can also indicate the nature of your emotional connections and experiences.

**Fate Line (if considered for category ${input.category}):**
The Fate Line, if prominent in this simulated reading for ${input.category}, traces the influences of external factors on your life path. It can show how much your life is predetermined versus how much is shaped by your own choices. Changes or breaks in this line might correlate with shifts in career or major life decisions.

**Specific Insights for Category: ${input.category} (Simulated)**

*   **${input.category} Aspect 1:** This simulated reading suggests that in the area of ${input.category}, you may find [Simulated Insight A, e.g., 'opportunities for growth through collaboration' or 'a period of emotional reflection leading to clarity'].
*   **${input.category} Aspect 2:** There's a potential for [Simulated Insight B, e.g., 'unexpected developments that require adaptability' or 'strengthening of key relationships through open communication'].
*   **${input.category} Aspect 3:** Consider focusing on [Simulated Advice, e.g., 'developing new skills to advance your career' or 'nurturing your well-being through mindful practices'].

**Conclusion (Simulated):**
This simulated reading for "${input.category}", based on your birth date ${input.dateOfBirth} and place of birth ${input.placeOfBirth}, provides a glimpse into potential patterns and tendencies. Remember that palmistry offers guidance, and your future is ultimately shaped by your choices and actions.

We hope this simulated report provides a helpful example. For a real reading, more detailed analysis of specific mounts, markings, and finger shapes would be undertaken.
    `;
    return { report: dummyReport.trim() };
  }
);
