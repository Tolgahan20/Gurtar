import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Logger,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { AuthenticatedRequest } from '../interfaces/authenticated-request.interface';

interface LogContext {
  type: 'request' | 'response' | 'error';
  method: string;
  url: string;
  userId?: string;
  requestId?: string;
  duration?: number;
  status?: number;
  error?: {
    message: string;
    stack?: string;
  };
}

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  private readonly logger = new Logger(LoggingInterceptor.name);

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest<AuthenticatedRequest>();
    const { method, url, user } = request;
    const now = Date.now();
    const requestId = this.getRequestId(request);

    // Log request
    this.logger.log(
      this.createLogContext({
        type: 'request',
        method,
        url,
        userId: user?.id,
        requestId,
      }),
    );

    return next.handle().pipe(
      tap({
        next: () => {
          // Log successful response
          this.logger.log(
            this.createLogContext({
              type: 'response',
              method,
              url,
              userId: user?.id,
              requestId,
              duration: Date.now() - now,
              status: context.switchToHttp().getResponse().statusCode,
            }),
          );
        },
        error: (error) => {
          // Log error
          this.logger.error(
            this.createLogContext({
              type: 'error',
              method,
              url,
              userId: user?.id,
              requestId,
              duration: Date.now() - now,
              error: {
                message: error.message,
                stack: error.stack,
              },
            }),
          );
        },
      }),
    );
  }

  private getRequestId(request: AuthenticatedRequest): string | undefined {
    const requestId = request.headers['x-request-id'];
    return Array.isArray(requestId) ? requestId[0] : requestId;
  }

  private createLogContext(context: LogContext): string {
    return JSON.stringify(context, null, 2);
  }
}
