import jsonwebtoken, { VerifyOptions } from 'jsonwebtoken'
import { config } from '@/config'
import { Request } from 'express'

export interface JwtPayload {
  // Define the properties of your JWT payload
  userId: string
  decoded: {
    session?: string
    // Other properties in your decoded payload
  }
}

export const signJWT = (payload: object, options?: object): string => {
  // Default options
  const defaultOptions = {
    expiresIn: config.jwt.expiresIn
  }

  // Merge provided options with default options
  const mergedOptions = { ...defaultOptions, ...options }

  return jsonwebtoken.sign(payload, config.jwt.secret, mergedOptions)
}

export const verifyJWT = (
  token: string,
  options?: VerifyOptions
): JwtPayload => {
  return jsonwebtoken.verify(token, config.jwt.secret, options) as JwtPayload
}

export const getTokenFromRequest = (req: Request): string | null => {
  const authorizationHeader = req.headers['authorization']
  if (!authorizationHeader) {
    return null
  }

  const [tokenType, token] = authorizationHeader.split(' ')
  if (tokenType !== 'Bearer') {
    return null
  }

  return token
}
