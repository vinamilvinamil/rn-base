import { z } from 'zod';

export const signInSchema = z.object({
    email: z.email("Enter a valid email").trim().min(1, 'Email is required'),
    password: z.string().min(1, 'Password is required'),
    remeberMe: z.boolean()
})

export type SignInFormValues = z.infer<typeof signInSchema>;

export const codeSchema = z.object({
    code: z.string().min(1, 'Enter the verification code.')
});

export type CodeFormValues = z.infer<typeof codeSchema>;