import jwt from 'jsonwebtoken'
import { IUserDocument } from '@/types'
import { Request, Response, NextFunction } from 'express'
import { config } from '@/config/index'
import { getUserById } from '@/services/user.service'
import AppError from '@/utils/AppError'

export async function isAuthenticatedMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  // Check if bearer token is present in the request headers
  const bearerToken = req.headers.authorization

  if (!bearerToken || !bearerToken.startsWith('Bearer ')) {
    throw new AppError('Unauthorized', 401)
  }

  // Extract the token from the authorization header
  const token = bearerToken.split(' ')[1]

  if (isValidToken(token)) {
    // If token is valid, assign the user to req.user
    const user: IUserDocument = await getUserFromToken(token)

    if (!user) {
      throw new AppError('Unauthorized', 401)
    }

    req.user = user

    return next()
  } else {
    throw new AppError('Unauthorized', 401)
  }
}

export function isValidToken(token: string): boolean {
  try {
    const secretKey = config.jwt.secret
    jwt.verify(token, secretKey)
    return true
  } catch (error) {
    return false
  }
}

export async function getUserFromToken(token: string): Promise<IUserDocument> {
  const secretKey = config.jwt.secret

  const decodedToken = jwt.verify(token, secretKey) as { id: string }

  const user = await getUserById(decodedToken.id)

  return user as IUserDocument
}
