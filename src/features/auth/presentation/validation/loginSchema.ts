import type { TFunction } from 'i18next';
import { z } from 'zod';

export const createLoginSchema = (t: TFunction) =>
  z.object({
    email: z
      .string()
      .trim()
      .min(
        1,
        t('auth.validation.emailRequired'),
      )
      .email(
        t('auth.validation.emailInvalid'),
      ),

    password: z
      .string()
      .min(
        1,
        t('auth.validation.passwordRequired'),
      ),
  });

export type LoginForm = z.infer<ReturnType<typeof createLoginSchema>>;