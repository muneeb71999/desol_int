import { NextFunction, Request, Response } from 'express'
import {
  userLoginSchema,
  userRegisterSchema
} from '@/validators/user.validator'
import { createUser, getUserByEmail } from '@/services/user.service'
import { successResponse } from '@/utils/success-response'
import { IUser } from '@/types'
import { generateAccessToken } from '@/services/auth.service'
import AppError from '@/utils/AppError'

export async function registerHandler(
  req: Request,
  res: Response,
  next: NextFunction
) {
  await req.validate(userRegisterSchema)

  const { name, email, password } = req.body

  const user = await createUser({
    name,
    email,
    password,
  } as IUser)

  const token = await generateAccessToken(user._id)

  const data = {
    user,
    token
  }

  successResponse(res, data, 'User created successfully')
}

export async function loginHandler(
  req: Request,
  res: Response,
  next: NextFunction
) {
  // validate the request body
  await req.validate(userLoginSchema)

  const { email, password } = req.body

  let user = await getUserByEmail(email, {
    password: 1,
    email: 1,
    name: 1,
    role: 1
  })

  if (!user) {
    throw new AppError('Invalid email or password', 400)
  }

  const isMatch = await user.comparePassword(password)

  if (!isMatch) {
    throw new AppError('Invalid email or password', 400)
  }

  user = user.toObject()

  // @ts-ignore
  delete user.password

  // @ts-ignore
  const token = generateAccessToken(user._id)

  const data = {
    user,
    token
  }

  successResponse(res, data, 'User logged in successfully')
}
