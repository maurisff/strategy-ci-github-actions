import AppError from '@utils/AppError'
import Logger from '@utils/Logger'
import { NextFunction, Request, Response } from 'express'

export default class ErrorHandlerMiddleware {
  static error (error: Error, _request: Request, response: Response, _next: NextFunction): Response {
    console.error('Internal server error: ', error)
    if (error instanceof AppError) {
      return response.status(error.statusCode).json({
        status: 'error',
        message: error.message
      })
    }
    Logger.error('Internal server error: ', error)
    return response.status(500).json({
      status: 'error',
      message: 'Internal server error\n' + error.message
    })
  }
}
