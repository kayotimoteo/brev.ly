import { defineConfig } from "drizzle-kit";
import { env } from "@/env";

export default defineConfig({
  dialect: "postgresql",
  dbCredentials: {
    url: env.DATABASE_URL,
  },
  schema: "src/infra/db/schemas/*",
  out: "src/infra/db/migrations",
});
