'use server';

/**
 * @fileOverview AI palm image quality validation agent.
 *
 * Inspects the user's submitted palm photos for clarity, hand presence,
 * lighting, angle and overall suitability for palmistry analysis. Returns a
 * quality score, pass/fail and a list of detected issues so the editor can
 * accept the images or request a resubmission.
 *
 * - validatePalmImages - Runs the validation flow.
 * - ValidatePalmImagesInput - Input type.
 * - ValidatePalmImagesOutput - Output type.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const ValidatePalmImagesInputSchema = z.object({
  frontPalmDataUri: z
    .string()
    .describe(
      "Photo of the front of the user's dominant palm as a data URI. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
  sidePalmDataUri: z
    .string()
    .describe(
      "Photo of the side of the user's dominant palm as a data URI. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
});
export type ValidatePalmImagesInput = z.infer<typeof ValidatePalmImagesInputSchema>;

const ValidatePalmImagesOutputSchema = z.object({
  score: z
    .number()
    .min(0)
    .max(100)
    .describe('Overall image quality score from 0 (unusable) to 100 (excellent).'),
  passed: z
    .boolean()
    .describe('True if BOTH images are clear enough for reliable palmistry analysis.'),
  issues: z
    .array(z.string())
    .describe('Concise list of detected problems (e.g. "Front image is blurry", "Hand not fully visible in side image"). Empty if none.'),
  summary: z
    .string()
    .describe('One or two sentence human-readable assessment for the editor.'),
});
export type ValidatePalmImagesOutput = z.infer<typeof ValidatePalmImagesOutputSchema>;

export async function validatePalmImages(
  input: ValidatePalmImagesInput
): Promise<ValidatePalmImagesOutput> {
  return validatePalmImagesFlow(input);
}

const prompt = ai.definePrompt({
  name: 'validatePalmImagesPrompt',
  input: { schema: ValidatePalmImagesInputSchema },
  output: { schema: ValidatePalmImagesOutputSchema },
  prompt: `You are an image quality inspector for a palmistry service. Two photos of a user's dominant hand were submitted: a FRONT (palm-facing) view and a SIDE view.

Assess BOTH images strictly for suitability for palm-line analysis. Evaluate:
1. Sharpness / blur — are the palm lines crisp and readable?
2. Hand presence — is a human hand clearly the main subject and fully in frame?
3. Lighting — is it well-lit without heavy shadows or blown-out highlights?
4. Angle / framing — front shows the open palm; side shows the edge of the hand.
5. Background — minimal clutter that does not obscure the hand.

Front of Dominant Palm: {{media url=frontPalmDataUri}}
Side of Dominant Palm: {{media url=sidePalmDataUri}}

Return:
- score: 0-100 overall quality (average the two, weighted by the worst image).
- passed: true ONLY if BOTH images are usable for reliable analysis (score should be >= 65 for a pass).
- issues: a short, specific list of problems. Empty array if the images are good.
- summary: a brief, professional one-or-two sentence verdict the editor can read at a glance.

Be conservative: if either image is blurry, dark, missing the hand, or wrongly angled, fail it.`,
});

const validatePalmImagesFlow = ai.defineFlow(
  {
    name: 'validatePalmImagesFlow',
    inputSchema: ValidatePalmImagesInputSchema,
    outputSchema: ValidatePalmImagesOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    if (!output) {
      throw new Error('The AI model did not return a valid image assessment. Please try again.');
    }
    return output;
  }
);
