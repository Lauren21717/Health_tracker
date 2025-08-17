import { PrismaClient } from "@prisma/client"

// Create a global variable to store the Prisma client
const globalForPrisma = globalThis as unknown as {
    prisma: PrismaClient | undefined
}

// Create or reuse the Prisma client
export const prisma = globalForPrisma.prisma ?? new PrismaClient({
    log: ['query', 'error', 'warn'],
})

// In development, store the client globally to prevent hot reload issues
if (process.env.NODE_ENV !== 'production') {
    globalForPrisma.prisma = prisma
}

// Export Prisma types for use in other packages
export * from '@prisma/client'