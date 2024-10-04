import { IUserDocument } from '@/types'
import { Request, Response, NextFunction } from 'express'
import { ValidateOptions, AnyObject, ObjectSchema } from 'yup'

declare global {
  namespace Express {
    interface Request {
      validate: (
        schema: ObjectSchema<AnyObject>,
        options?: ValidateOptions<AnyObject>
      ) => Promise<void>
      validateQuery: (
        schema: ObjectSchema<AnyObject>,
        options?: ValidateOptions<AnyObject>
      ) => Promise<void>
      user?: IUserDocument
    }
  }
}

export const requestValidationMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  req.validate = async (
    schema: ObjectSchema<AnyObject>,
    options?: ValidateOptions<AnyObject>
  ) => {
    try {
      const validData = await schema.validate(req.body, {
        abortEarly: false,
        ...options
      })
      req.body = validData
    } catch (error) {
      throw error
    }
  }

  req.validateQuery = async (
    schema: ObjectSchema<AnyObject>,
    options?: ValidateOptions<AnyObject>
  ) => {
    try {
      const validData = await schema.validate({...req.query, ...req.params}, {
        abortEarly: false,
        ...options
      })
      req.query = validData
    } catch (error) {
      throw error
    }
  }

  next()
}
