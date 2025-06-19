
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
    // Simulate a more detailed dummy report based on category
    let specificInsights = '';
    switch (input.category) {
      case "General Personality":
        specificInsights = `
*   **Core Traits:** This simulated reading suggests a personality that is [Simulated Trait A, e.g., 'naturally curious and adaptable' or 'grounded and determined']. Your approach to life appears to be [Simulated Approach, e.g., 'methodical and thoughtful' or 'spontaneous and intuitive'].
*   **Strengths & Challenges:** Potential strengths indicated include [Simulated Strength, e.g., 'strong communication skills' or 'innate resilience']. Areas for growth might involve [Simulated Challenge, e.g., 'learning to delegate more effectively' or 'embracing change more readily'].
*   **Outlook:** Your general outlook on life seems to be [Simulated Outlook, e.g., 'optimistic, with a focus on future possibilities' or 'practical, with an emphasis on current realities'].
        `;
        break;
      case "Career & Finance":
        specificInsights = `
*   **Career Path:** Indications suggest a suitability for careers that involve [Simulated Career Aspect, e.g., 'analytical thinking and problem-solving' or 'creativity and innovation']. There may be periods of significant career development or change.
*   **Financial Tendencies:** Your approach to finances appears to be [Simulated Financial Trait, e.g., 'prudent and savings-oriented' or 'inclined towards calculated risks for growth']. Opportunities for financial improvement may arise through [Simulated Financial Opportunity, e.g., 'strategic investments' or 'leveraging your unique skills'].
*   **Work Style:** You likely thrive in environments that [Simulated Work Environment, e.g., 'offer autonomy and intellectual stimulation' or 'are collaborative and supportive'].
        `;
        break;
      case "Health & Wellness":
        specificInsights = `
*   **Vitality Levels:** The palm suggests a baseline vitality that is [Simulated Vitality, e.g., 'generally robust, with good energy reserves' or 'requiring consistent attention to maintain balance'].
*   **Potential Sensitivities:** There might be a predisposition towards [Simulated Sensitivity, e.g., 'digestive sensitivities' or 'stress-related tension']. Awareness and proactive care in these areas are beneficial.
*   **Wellness Practices:** Practices that could particularly support your well-being include [Simulated Wellness Practice, e.g., 'mindfulness and meditation for stress management' or 'regular physical activity to boost energy levels'].
        `;
        break;
      case "Marriage & Relationships":
        specificInsights = `
*   **Emotional Style:** In relationships, you tend to be [Simulated Emotional Style, e.g., 'expressive and nurturing' or 'loyal and steadfast']. Your communication in partnerships is key.
*   **Partnership Dynamics:** You may seek partnerships that offer [Simulated Partnership Quality, e.g., 'intellectual connection and shared growth' or 'emotional security and mutual support']. Potential challenges in relationships could stem from [Simulated Relationship Challenge, e.g., 'differing communication styles' or 'balancing independence with togetherness'].
*   **Family Life:** Indications about family life suggest [Simulated Family Aspect, e.g., 'a strong sense of duty and connection' or 'a journey towards creating a harmonious home environment'].
        `;
        break;
      case "Comprehensive Analysis":
        specificInsights = `
*   **Overall Life Theme:** A recurring theme in your palm appears to be [Simulated Life Theme, e.g., 'a journey of self-discovery and transformation' or 'building stability and leaving a lasting legacy'].
*   **Interconnectedness:** The lines suggest a strong interplay between your career choices and personal relationships, where success in one area often influences the other. Your health and vitality are foundational to achieving your goals across all aspects of life.
*   **Key Periods:** Markings may indicate significant periods of change or opportunity around [Simulated Age Range/Life Event, e.g., 'your late twenties related to career' or 'mid-life concerning personal growth'].
*   **Spiritual Path:** There could be an inclination towards [Simulated Spiritual Aspect, e.g., 'exploring philosophical questions' or 'finding meaning through service to others'].
        `;
        break;
      default:
        specificInsights = `
*   **${input.category} Aspect 1:** This simulated reading suggests that in the area of ${input.category}, you may find [Simulated Insight A, e.g., 'opportunities for growth through collaboration' or 'a period of emotional reflection leading to clarity'].
*   **${input.category} Aspect 2:** There's a potential for [Simulated Insight B, e.g., 'unexpected developments that require adaptability' or 'strengthening of key relationships through open communication'].
*   **${input.category} Aspect 3:** Consider focusing on [Simulated Advice, e.g., 'developing new skills to advance your career' or 'nurturing your well-being through mindful practices'].
        `;
    }

    const dummyReport = `
## Palm Reading Report for Category: ${input.category}

**User Details (Simulated Context):**
*   Date of Birth: ${input.dateOfBirth}
*   Place of Birth: ${input.placeOfBirth}
*   Time of Birth: ${input.timeOfBirth || 'Not Specified'}
*   Dominant Hand: ${input.dominantHand}

**Introduction:**
This simulated palm reading offers insights based on the category of "${input.category}". Palmistry is an ancient art, and this report provides a generalized interpretation for demonstration purposes. Your dominant hand, the ${input.dominantHand} hand, primarily reflects your current life path and conscious actions, while your non-dominant hand reveals your innate potential and past influences.

**Key Observations (Simulated General Palm Features):**

**Life Line:**
Your Life Line appears to be well-defined and suggests a good level of vitality and enthusiasm for life. There are indications of significant life events that could shape your journey. Minor breaks or islands might represent periods of change or challenge, but overall, the line shows resilience.

**Head Line:**
The Head Line indicates your intellectual style and how you approach problems. A clear, long Head Line (simulated here) suggests a logical and analytical mind. If it were sloping, it might indicate creativity, while a straight line points to a more practical approach.

**Heart Line:**
The Heart Line provides insights into your emotional nature and how you form connections. A curved Heart Line often signifies a warm and expressive individual. The length and depth can also indicate the nature of your emotional experiences.

**Fate Line (Simulated Consideration):**
The Fate Line, if prominent in this simulated reading, traces the influences of external factors on your life path. It can show how much your life is predetermined versus how much is shaped by your own choices. Changes or breaks in this line might correlate with shifts in career or major life decisions.

**Specific Insights for Category: ${input.category} (Simulated)**
${specificInsights}

**Conclusion (Simulated):**
This simulated reading for "${input.category}" provides a glimpse into potential patterns and tendencies. Remember that palmistry offers guidance, and your future is ultimately shaped by your choices and actions.

We hope this simulated report provides a helpful example. For a real reading, more detailed analysis of specific mounts, markings, and finger shapes would be undertaken by our AI and human experts.
    `;
    return { report: dummyReport.trim() };
  }
);
