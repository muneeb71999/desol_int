import { config } from '@/config';
import OpenAI from 'openai';

export const openAI = new OpenAI({
  apiKey: config.openai.apiKey,
});
