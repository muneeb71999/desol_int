import jwt from 'jsonwebtoken'
import { config } from '@/config'

export function generateAccessToken(userId: string) {
  return jwt.sign({ id: userId }, config.jwt.secret, {
    expiresIn: config.jwt.expiresIn
  })
}