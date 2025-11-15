import { Request, Response, NextFunction } from 'express';
import { ApiResponse } from '../types';
export declare class AppError extends Error {
    statusCode: number;
    message: string;
    isOperational: boolean;
    constructor(statusCode: number, message: string, isOperational?: boolean);
}
export declare const errorHandler: (err: Error | AppError, req: Request, res: Response<ApiResponse>, next: NextFunction) => Response<ApiResponse<any>, Record<string, any>>;
export declare const asyncHandler: (fn: Function) => (req: Request, res: Response, next: NextFunction) => void;
//# sourceMappingURL=errorHandler.d.ts.map