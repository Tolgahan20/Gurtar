import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Response } from 'express';
import { AuthenticatedRequest } from '../interfaces/authenticated-request.interface';

interface ErrorResponse {
  statusCode: number;
  timestamp: string;
  path: string;
  method: string;
  message: string | null;
  error: string;
  details: Record<string, any> | null;
}

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(HttpExceptionFilter.name);

  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<AuthenticatedRequest>();
    const status = exception.getStatus();
    const exceptionResponse = exception.getResponse();

    const errorResponse: ErrorResponse = {
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      method: request.method,
      message: exception.message || null,
      error: exception.name,
      details: this.isValidationError(status, exceptionResponse)
        ? exceptionResponse
        : null,
    };

    // Log error
    this.logger.error({
      ...errorResponse,
      stack: exception.stack,
      userId: request.user?.id,
    });

    response.status(status).json(errorResponse);
  }

  private isValidationError(
    status: number,
    response: unknown,
  ): response is Record<string, any> {
    return (
      Number(status) === Number(HttpStatus.BAD_REQUEST) &&
      typeof response === 'object' &&
      response !== null
    );
  }
}
