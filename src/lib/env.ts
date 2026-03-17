import { z } from 'zod'

const envSchema = z.object({
  NODE_ENV: z
    .enum(['development', 'production', 'test'])
    .default('development'),
  VERCEL_URL: z.string().optional(),
  NEXT_PUBLIC_APP_URL: z.string().url().optional(),
  NOTION_API_KEY: z.string().min(1).optional(),
  NOTION_DATABASE_ID: z.string().min(1).optional(),
  NEXT_PUBLIC_SITE_URL: z.string().url().optional(),
  // Admin Authentication
  ADMIN_USERNAME: z.string().min(1),
  ADMIN_PASSWORD_HASH: z
    .string()
    .optional()
    .default('')
    .refine(val => val === '' || val.startsWith('$2b$'), {
      message: 'Invalid string: must start with "$2b$"',
    }),
  ADMIN_SESSION_SECRET: z.string().min(32),
})

export const env = envSchema.parse({
  NODE_ENV: process.env.NODE_ENV,
  VERCEL_URL: process.env.VERCEL_URL,
  NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
  NOTION_API_KEY: process.env.NOTION_API_KEY,
  NOTION_DATABASE_ID: process.env.NOTION_DATABASE_ID,
  NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL,
  ADMIN_USERNAME: process.env.ADMIN_USERNAME,
  ADMIN_PASSWORD_HASH: process.env.ADMIN_PASSWORD_HASH,
  ADMIN_SESSION_SECRET: process.env.ADMIN_SESSION_SECRET,
})

export type Env = z.infer<typeof envSchema>
