import { Request, Response, NextFunction } from 'express';
import { ApiResponse } from '../types';

/**
 * Класс для операционных ошибок приложения
 */
export class AppError extends Error {
  public additionalData?: any;

  constructor(
    public statusCode: number,
    public message: string,
    additionalData?: any,
    public isOperational = true
  ) {
    super(message);
    this.additionalData = additionalData;
    Object.setPrototypeOf(this, AppError.prototype);
  }
}

/**
 * Middleware для обработки ошибок
 * Формирует ответ в формате, указанном в ТЗ
 */
export const errorHandler = (
  err: Error | AppError,
  req: Request,
  res: Response<ApiResponse>,
  next: NextFunction
) => {
  if (err instanceof AppError) {
    // Если есть дополнительные данные с endpoint и status, используем их
    if (err.additionalData) {
      return res.status(err.statusCode).json({
        success: false,
        status: err.additionalData.status || err.statusCode,
        endpoint: err.additionalData.endpoint,
        message: err.message,
      });
    }

    return res.status(err.statusCode).json({
      success: false,
      status: err.statusCode,
      message: err.message,
    });
  }

  console.error('Unexpected error:', err);
  
  return res.status(500).json({
    success: false,
    status: 500,
    message: 'Internal server error',
  });
};

/**
 * Wrapper для async route handlers
 * Автоматически ловит ошибки и передает в error handler
 */
export const asyncHandler = (fn: Function) => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};
