import {genkit} from 'genkit';
import {googleAI} from '@genkit-ai/googleai';

// This initialization relies on the GOOGLE_API_KEY being available in the environment
// when this server-side code is executed.
export const ai = genkit({
  plugins: [googleAI()],
  model: 'googleai/gemini-2.0-flash', // Default model for other potential uses
});
