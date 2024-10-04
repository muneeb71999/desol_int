import { AnyObject, ObjectSchema, ValidateOptions } from 'yup'
import { IUserDocument } from './src/types'

declare module 'express' {
  namespace Express {
    interface Request {
      validate: (
        schema: ObjectSchema<AnyObject>,
        options?: ValidateOptions<AnyObject>
      ) => Promise<void>
      user?: IUserDocument
    }
  }
}
