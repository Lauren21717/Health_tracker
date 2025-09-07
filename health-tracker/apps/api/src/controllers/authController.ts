import { Request, Response, NextFunction } from 'express'
import { prisma } from '@health-tracker/db'
import {
  RegisterSchema,
  LoginSchema,
  type RegisterRequest,
  type LoginRequest
} from '@health-tracker/types'
import { hashPassword, comparePassword } from '../utils/password'
import { generateTokens, verifyRefreshToken } from '../utils/jwt'

export const register = async (
  req: Request<{}, {}, RegisterRequest>,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email, password, name } = req.body

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: email.toLowerCase() }
    })

    if (existingUser) {
      return res.status(409).json({
        success: false,
        error: 'User already exists',
        message: 'An account with this email already exists'
      })
    }

    // Hash password
    const passwordHash = await hashPassword(password)

    // Create user
    const user = await prisma.user.create({
      data: {
        email: email.toLowerCase(),
        passwordHash,
        name: name || null
      },
      select: {
        id: true,
        email: true,
        name: true,
        createdAt: true
      }
    })

    // Generate tokens
    const { accessToken, refreshToken } = generateTokens(user.id, user.email)

    // Set refresh token as httpOnly cookie
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    })

    res.status(201).json({
      success: true,
      data: {
        user,
        accessToken,
        expiresIn: process.env.JWT_ACCESS_EXPIRES_IN || '15m'
      },
      message: 'Account created successfully'
    })
  } catch (error) {
    next(error)
  }
}

export const login = async (
  req: Request<{}, {}, LoginRequest>,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email, password } = req.body

    // Find user
    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase() }
    })

    if (!user) {
      return res.status(401).json({
        success: false,
        error: 'Invalid credentials',
        message: 'Email or password is incorrect'
      })
    }

    // Verify password
    const isPasswordValid = await comparePassword(password, user.passwordHash)

    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        error: 'Invalid credentials',
        message: 'Email or password is incorrect'
      })
    }

    // Generate tokens
    const { accessToken, refreshToken } = generateTokens(user.id, user.email)

    // Set refresh token as httpOnly cookie
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    })

    res.json({
      success: true,
      data: {
        user: {
          id: user.id,
          email: user.email,
          name: user.name
        },
        accessToken,
        expiresIn: process.env.JWT_ACCESS_EXPIRES_IN || '15m'
      },
      message: 'Login successful'
    })
  } catch (error) {
    next(error)
  }
}

export const refresh = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { refreshToken } = req.cookies

    if (!refreshToken) {
      return res.status(401).json({
        success: false,
        error: 'Refresh token required'
      })
    }

    // Verify refresh token
    const payload = verifyRefreshToken(refreshToken)

    // Verify user still exists
    const user = await prisma.user.findUnique({
      where: { id: payload.userId },
      select: { id: true, email: true, name: true }
    })

    if (!user) {
      return res.status(401).json({
        success: false,
        error: 'User not found'
      })
    }

    // Generate new tokens
    const tokens = generateTokens(user.id, user.email)

    // Set new refresh token as httpOnly cookie
    res.cookie('refreshToken', tokens.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    })

    res.json({
      success: true,
      data: {
        user,
        accessToken: tokens.accessToken,
        expiresIn: process.env.JWT_ACCESS_EXPIRES_IN || '15m'
      }
    })
  } catch (error) {
    next(error)
  }
}

export const logout = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // Clear refresh token cookie
    res.clearCookie('refreshToken')

    res.json({
      success: true,
      message: 'Logout successful'
    })
  } catch (error) {
    next(error)
  }
}

export const me = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user!.id },
      select: {
        id: true,
        email: true,
        name: true,
        dob: true,
        gender: true,
        createdAt: true
      }
    })

    res.json({
      success: true,
      data: { user }
    })
  } catch (error) {
    next(error)
  }
}