import { z } from "zod";

const clientEnvSchema = z.object({
  NEXT_PUBLIC_API_BASE_URL: z.string().url(),
  NEXT_PUBLIC_APP_URL: z.string().url(),
});

const DEV_DEFAULTS = {
  NEXT_PUBLIC_API_BASE_URL: "http://localhost:8080/v1",
  NEXT_PUBLIC_APP_URL: "http://localhost:3000",
} as const;

function parseClientEnv() {
  return clientEnvSchema.parse({
    NEXT_PUBLIC_API_BASE_URL:
      process.env.NEXT_PUBLIC_API_BASE_URL ?? DEV_DEFAULTS.NEXT_PUBLIC_API_BASE_URL,
    NEXT_PUBLIC_APP_URL:
      process.env.NEXT_PUBLIC_APP_URL ?? DEV_DEFAULTS.NEXT_PUBLIC_APP_URL,
  });
}

export const env = {
  client: parseClientEnv(),
  get apiBaseUrl() {
    return process.env.API_BASE_URL ?? env.client.NEXT_PUBLIC_API_BASE_URL;
  },
};
