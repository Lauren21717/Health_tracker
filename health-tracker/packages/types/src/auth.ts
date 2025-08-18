import { z } from 'zod'

// User registration schema
export const RegisterSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, 'Password must contain at least one uppercase letter, one lowercase letter, and one number'),
  name: z.string().optional(),
})

// User login schema
export const LoginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(1, 'Password is required'),
})

// Password reset request
export const PasswordResetSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
})

// New password schema
export const NewPasswordSchema = z.object({
  password: z.string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, 'Password must contain at least one uppercase letter, one lowercase letter, and one number'),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
})

// Infer TypeScript types from Zod schemas
export type RegisterRequest = z.infer<typeof RegisterSchema>
export type LoginRequest = z.infer<typeof LoginSchema>
export type PasswordResetRequest = z.infer<typeof PasswordResetSchema>
export type NewPasswordRequest = z.infer<typeof NewPasswordSchema>