
import { config } from 'dotenv';
config();

import '@/ai/flows/suggest-report-improvements.ts';
import '@/ai/flows/generate-palm-reading.ts';
import '@/ai/flows/process-user-report-feedback.ts';
import '@/ai/flows/refine-palm-reading-report.ts';
import '@/ai/flows/validate-palm-images.ts';
