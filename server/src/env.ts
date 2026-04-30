import { z } from "zod";

const envSchema = z.object({
  PORT: z.coerce.number().default(3333),

  /** Mesma URL usada pelo app (postgres.js) e pelo drizzle-kit. */
  DATABASE_URL: z.string().url().startsWith("postgresql://"),

  CLOUDFLARE_ACCOUNT_ID: z.string(),
  CLOUDFLARE_ACCESS_KEY_ID: z.string(),
  CLOUDFLARE_SECRET_ACCESS_KEY: z.string(),
  CLOUDFLARE_PUBLIC_URL: z.string().url(),
  CLOUDFLARE_BUCKET: z.string(),
});

export const env = envSchema.parse(process.env);
