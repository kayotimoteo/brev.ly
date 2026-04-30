import { z } from 'zod';

export const envSchema = z.object({
  VITE_PORT: z.coerce.number().default(4000),
  VITE_FRONTEND_URL: z.url(),
  VITE_BACKEND_URL: z.url(),
});

export const env = envSchema.parse(import.meta.env);