import { Response } from 'express'

export function successResponse(res: Response, data: any, message?: string) {
  return res.status(200).json({
    status: 'success',
    message: message || '',
    data: data
  })
}
