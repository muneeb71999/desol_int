class AppError extends Error {
  statusCode: number
  stack?: string

  constructor(message: string, statusCode?: number) {
    super(message)
    this.statusCode = statusCode || 500
    this.name = 'AppError'

    // Capture the stack trace
    Error.captureStackTrace(this, this.constructor)
  }
}

export default AppError
