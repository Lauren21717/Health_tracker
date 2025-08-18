import { z } from 'zod'

// Generic API response wrapper
export const ApiResponse = <T extends z.ZodTypeAny>(data: T) => z.object({
    success: z.boolean(),
    data: data.optional(),
    error: z.string().optional(),
    message: z.string().optional(),
})

// Pagination schema
export const PaginationSchema = z.object({
    page: z.number().min(1).default(1),
    limit: z.number().min(1).max(100).default(20),
    total: z.number().min(0),
    totalPages: z.number().min(0),
})

// Date range filter
export const DateRangeSchema = z.object({
  startDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
  endDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
}).refine((data) => {
  if (data.startDate && data.endDate) {
    return new Date(data.startDate) <= new Date(data.endDate)
  }
  return true
}, {
  message: "End date must be after start date",
  path: ["endDate"],
})

// Query parameters for list endpoints
export const ListQuerySchema = z.object({
  page: z.string().transform(Number).pipe(z.number().min(1)).optional(),
  limit: z.string().transform(Number).pipe(z.number().min(1).max(100)).optional(),
  sortBy: z.string().optional(),
  sortOrder: z.enum(['asc', 'desc']).optional(),
}).merge(DateRangeSchema)

// Error response schema
export const ErrorResponseSchema = z.object({
    success: z.literal(false),
    error: z.string(),
    message: z.string().optional(),
    details: z.record(z.any()).optional(),
})

// Authentication token response
export const authTokenSchema = z.object({
    accessToken: z.string(),
    refreshToken: z.string(),
    expiresIn: z.number(),
    user: z.object({
        id: z.string(),
        email: z.string(),
        name: z.string().nullable(),
    }),
})

// Infer type
export type ApiResponseType<T> = {
    success: boolean
    data?: T
    error?: string
    message?: string
}

export type PaginationType = z.infer<typeof PaginationSchema>
export type DateRange = z.infer<typeof DateRangeSchema>
export type ListQuery = z.infer<typeof ListQuerySchema>
export type ErrorResponse = z.infer<typeof ErrorResponseSchema>
export type AuthToken = z.infer<typeof AuthTokenSchema>