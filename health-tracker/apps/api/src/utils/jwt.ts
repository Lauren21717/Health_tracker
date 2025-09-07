import jwt from 'jsonwebtoken'

interface TokenPayload {
  userId: string
  email: string
  type: 'access' | 'refresh'
}

interface UserTokens {
  accessToken: string
  refreshToken: string
}

export const generateTokens = (userId: string, email: string): UserTokens => {
  const accessTokenPayload: TokenPayload = {
    userId,
    email,
    type: 'access'
  }

  const refreshTokenPayload: TokenPayload = {
    userId,
    email,
    type: 'refresh'
  }

  const accessToken = jwt.sign(
    accessTokenPayload,
    process.env.JWT_ACCESS_SECRET!,
    { expiresIn: process.env.JWT_ACCESS_EXPIRES_IN || '15m' }
  )

  const refreshToken = jwt.sign(
    refreshTokenPayload,
    process.env.JWT_REFRESH_SECRET!,
    { expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d' }
  )

  return { accessToken, refreshToken }
}

export const verifyAccessToken = (token: string): TokenPayload => {
  return jwt.verify(token, process.env.JWT_ACCESS_SECRET!) as TokenPayload
}

export const verifyRefreshToken = (token: string): TokenPayload => {
  return jwt.verify(token, process.env.JWT_REFRESH_SECRET!) as TokenPayload
}

export const extractTokenFromHeader = (authHeader?: string): string | null => {
  if (!authHeader) return null
  
  const parts = authHeader.split(' ')
  if (parts.length !== 2 || parts[0] !== 'Bearer') return null
  
  return parts[1]
}