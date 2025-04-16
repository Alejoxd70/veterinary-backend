import { z } from 'zod'

export const userSchema = z.object({
  name: z.string().min(2, 'Name is required').max(50, 'Name is too long'),
  email: z.string().email('Invalid email address').max(100, 'Email is too long'),
  password: z.string().min(8, 'Password is required and must be at least 8 characters long')
})

export const userLoginSchema = z.object({
  email: z.string().email('Invalid email address').max(100, 'Email is too long'),
  password: z.string().min(8, 'Password is required and must be at least 8 characters long')
})
