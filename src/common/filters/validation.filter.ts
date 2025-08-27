import { ExceptionFilter, Catch, ArgumentsHost, Logger } from '@nestjs/common';
import { ValidationError } from 'class-validator';
import { Response } from 'express';
import { AuthenticatedRequest } from '../interfaces/authenticated-request.interface';

interface ValidationErrors {
  [key: string]: string[] | ValidationErrors;
}

interface ValidationErrorResponse {
  statusCode: number;
  message: string;
  errors: ValidationErrors;
  timestamp: string;
  path: string;
  method: string;
}

@Catch(ValidationError)
export class ValidationFilter implements ExceptionFilter {
  private readonly logger = new Logger(ValidationFilter.name);

  catch(exception: ValidationError[], host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<AuthenticatedRequest>();

    const formatErrors = (errors: ValidationError[]): ValidationErrors => {
      return errors.reduce((acc, error) => {
        if (error.constraints) {
          acc[error.property] = Object.values(error.constraints);
        }
        if (error.children?.length) {
          acc[error.property] = formatErrors(error.children);
        }
        return acc;
      }, {} as ValidationErrors);
    };

    const errorResponse: ValidationErrorResponse = {
      statusCode: 400,
      message: 'Validation failed',
      errors: formatErrors(exception),
      timestamp: new Date().toISOString(),
      path: request.url,
      method: request.method,
    };

    // Log validation errors
    this.logger.warn({
      ...errorResponse,
      userId: request.user?.id,
    });

    response.status(400).json(errorResponse);
  }
}
