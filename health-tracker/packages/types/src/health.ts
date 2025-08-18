import { z } from 'zod'

// Daily metrics schema
export const DailyMetricSchema = z.object({
    date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be in YYYY-MM-DD format'),
    weight: z.number().positive('Weight must be positive').max(500, 'Weight seems unrealistic').optional(),
    bodyFatPct: z.number().min(0, 'Body fat percentage cannot be negative').max(50, 'Body fat percentage seems unrealistic'),
    skeletalMuscleMass: z.number().positive('Muscle mass must be positive').optional(),
    restingHR: z.number().min(20, 'Heart rate seems too low').max(250, 'Heart rate seems too high').optional(),
})

// Workout schema
export const WorkoutSchema = z.object({
    startTime: z.string().datetime('Invalid start time'),
    endTime: z.string().datetime('Invalid end time'),
    type: z.enum(['strength', 'cardio', 'hiit', 'yoga', 'sports', 'other']),
    intensity: z.number().min(1, 'Intensity must be at least 1').max(10, 'Intensity cannot exceed 10'),
    calories: z.number().positive('Calories must be positive').optional(),
    avgHR: z.number().min(20).max(250).optional(),
    maxHR: z.number().min(20).max(250).optional(),
    notes: z.string().max(500, 'Notes cannot exceed 500 characters').optional(),
}).refine((data) => new Date(data.endTime) > new Date(data.startTime), {
    message: "End time must be after start time",
    path: ["endtime"],
})

// Meal schema
export const MealSchema = z.object({
    mealTime: z.string().datetime('Invalid meal time'),
    foodName: z.string().min(1, 'Food name is required').max(100, 'Food name too long'),
    calories: z.number().positive('Calories must be positive').max(5000, 'Calories seem unrealistic'),
    protein: z.number().min(0, 'Protein cannot be negative').max(200, 'Protein seems unrealistic').optional(),
    carbs: z.number().min(0, 'Carbs cannot be negative').max(500, 'Carbs seem unrealistic').optional(),
    fat: z.number().min(0, 'Fat cannot be negative').max(200, 'Fat seems unrealistic').optional(),
    notes: z.string().max(200, 'Notes cannot exceed 200 characters').optional(),
})

// Sleep schema
export const SleepSessionSchema = z.object({
    startTime: z.string().datetime('Invalid start time'),
    endTime: z.string().datetime('Invalid end time'),
    efficiency: z.number().min(0, 'Efficiency cannot be negative').max(100, 'Efficiency cannot exceed 100%').optional(),
    sleepStages: z.record(z.any()).optional(), // JSON data
    notes: z.string().max(300, 'Notes cannot exceed 300 characters').optional(),
}).refine((data) => new Date(data.endTime) > new Date(data.startTime), {
    message: 'End time must be after start time',
    path: ["endTime"],
})

// Fasting schema
export const FastingWindowSchema = z.object({
    startTime: z.string().datetime('Invalid start time'),
    endTime: z.string().datetime('Invalid end time').optional(),
    notes: z.string().max(300, 'Notes cannot exceed 300 characters').optional(),
})

// Mood and cycle schema
export const MoodCycleSchema = z.object({
    date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be in YYYY-MM-DD format'),
    mood: z.number().min(1, 'Mood must be at least 1').max(10, 'Mood cannot exceed 10').optional(),
    cycleDay: z.number().positive('Cycle day must be positive').max(50, 'Cycle day seems unrealistic').optional(),
    symptoms: z.array(z.string()).optional(),
    notes: z.string().max(300, 'Notes cannot exceed 300 characters').optional(),
})

// Goal schema
export const GoalSchema = z.object({
    type: z.enum(['weight_loss', 'weight_gain', 'workout_frequency', 'nutrition', 'sleep', 'other']),
    target: z.number(),
    current: z.number().optional(),
    unit: z.string().min(1, 'Unit is required'),
    deadline: z.string().datetime('Invalid deadline').optional(),
})

// Infer Typescript types
export type DailyMetric = z.infer<typeof DailyMetricSchema>
export type Workout = z.infer<typeof WorkoutSchema>
export type Meal = z.infer<typeof MealSchema>
export type SleepSession = z.infer<typeof SleepSessionSchema>
export type FastingWindow = z.infer<typeof FastingWindowSchema>
export type MoodCycle = z.infer<typeof MoodCycleSchema>
export type Goal = z.infer<typeof GoalSchema>

// Workout types enum for reuse
export const WorkoutTypes = ['strength', 'cardio', 'hiit', 'yoga', 'sports', 'other'] as const
export type WorkoutType = typeof WorkoutTypes[number]