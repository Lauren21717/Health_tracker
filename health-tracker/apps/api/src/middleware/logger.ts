import { Request, Response, NextFunction } from 'express'

export const requestLogger = (req: Request, res: Response, next: NextFunction) => {
  const start = Date.now()
  
  // Generate correlation ID for request tracking
  const correlationId = Math.random().toString(36).substring(7)
  req.correlationId = correlationId
  
  console.log(`[${correlationId}] ${req.method} ${req.path} - ${req.ip}`)
  
  // Log response when finished
  res.on('finish', () => {
    const duration = Date.now() - start
    console.log(`[${correlationId}] ${res.statusCode} - ${duration}ms`)
  })
  
  next()
}

// Extend Express Request type
declare global {
  namespace Express {
    interface Request {
      correlationId?: string
      user?: {
        id: string
        email: string
      }
    }
  }
}