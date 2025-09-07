import { Request, Response, NextFunction } from 'express'
import { verifyAccessToken, extractTokenFromHeader } from '../utils/jwt'
import { prisma } from '@health-tracker/db'

export const authenticateToken = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const token = extractTokenFromHeader(req.headers.authorization)

        if (!token) {
            return res.status(401).json({
                success: false,
                error: 'Access token required'
            })
        }

        const payload = verifyAccessToken(token)

        // Verify user still exists
        const user = await prisma.user.findUnique({
            where: { id: payload.userId },
            select: { id: true, email: true, name: true}
        })

        if (!user) {
            return res.status(401).json({
                success: false,
                error: 'User not found'
            })
        }

        // Add user to reqquest object
        req.user = {
            id: user.id, 
            email: user.email
        }

        next()
    } catch (error) {
        next(error)
    }
}

export const optionalAuth = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const token = extractTokenFromHeader(req.headers.authorization)

        if (token) {
            const payload = verifyAccessToken(token)
            const user = await prisma.user.findUnique({
                where: { id: payload.userId },
                select: { id: true, email: true }
            })

            if (user) {
                req.user = {
                    id: user.id, 
                    email:user.email
                }
            }
        }

        next()
    } catch (error) {
        next()
    }
}

