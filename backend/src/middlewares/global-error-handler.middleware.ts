import { config } from '@/config'
import { IErrorResponse } from '@/types'
import { Request, Response, NextFunction } from 'express'

export const globalErrorHandlerMiddleware = (
  error: any,
  req: Request,
  res: Response<IErrorResponse>,
  next: NextFunction
) => {
  let statusCode = error.statusCode || 500
  let message = 'Validation Error'
  let errors = error.errors || []

  console.log(error)

  if (error.name === 'ValidationError') {
    errors = handleValidationError(error)
  }

  if (error.name === 'MongoServerError' && error.code === 11000) {
    errors = handleDuplicateKeyError(error)
  }

  if (error.name === 'AppError') {
    errors = [error.message]
  }

  const response: IErrorResponse = {
    message: message,
    error: errors
  }

  if (config.app.env === 'development') {
    response.orignal_error = error
  }

  return res.status(statusCode).json(response)
}

function handleValidationError(error: any) {
  let errors: any[] = []

  if (error.inner && error.inner.length > 0) {
    errors = error.inner.map((err: any) => err.message)
  } else {
    errors = Object.keys(error.errors).map((key) => {
      return formatErrorMessage(error.errors[key].message)
    })
  }

  return {
    messages: errors
  }
}

function handleDuplicateKeyError(error: any) {
  const field = Object.keys(error.keyValue)
  const message = `A record with this ${field} already exists.`
  return { messages: [message] }
}

function formatErrorMessage(message: string) {
  let pattern = /Path `([^`]+)` is required./
  let replacement = '$1 field is required'

  if (message.startsWith('Path')) {
    pattern = /Path `([^`]+)` is required./
    replacement = '$1 field is required'
  }

  if (message.startsWith('Cast to')) {
    pattern = /Cast to ([^ ]+) failed/
    replacement = 'Invalid $1'
  }

  return message.replace(pattern, replacement)
}
