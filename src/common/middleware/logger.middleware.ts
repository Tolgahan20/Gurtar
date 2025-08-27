import { Injectable, NestMiddleware, Logger } from '@nestjs/common';
import { NextFunction, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { AuthenticatedRequest } from '../interfaces/authenticated-request.interface';

interface LogMetadata {
  type: 'request' | 'response';
  method: string;
  url: string;
  ip: string;
  userAgent: string;
  requestId: string;
  userId?: string;
  duration?: number;
  statusCode?: number;
}

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  private readonly logger = new Logger('HTTP');

  use(req: AuthenticatedRequest, res: Response, next: NextFunction): void {
    const method = req.method;
    const url = req.originalUrl;
    const ip = req.ip || req.connection.remoteAddress || 'unknown';
    const userAgent = req.get('user-agent') || 'unknown';
    const requestId = this.getRequestId(req);

    // Add request ID to response headers
    res.setHeader('x-request-id', requestId);

    // Create base log metadata
    const baseMetadata = {
      method,
      url,
      ip,
      userAgent,
      requestId,
      userId: req.user?.id,
    };

    // Log request
    const requestLog: LogMetadata = {
      ...baseMetadata,
      type: 'request',
    };

    this.logger.log(this.formatLog(requestLog));

    // Track response time
    const start = Date.now();

    // Log response
    res.on('finish', () => {
      const responseLog: LogMetadata = {
        ...baseMetadata,
        type: 'response',
        duration: Date.now() - start,
        statusCode: res.statusCode,
      };

      this.logger.log(this.formatLog(responseLog));
    });

    next();
  }

  private getRequestId(req: AuthenticatedRequest): string {
    const headerValue = req.headers['x-request-id'];
    if (Array.isArray(headerValue)) {
      return headerValue[0] || uuidv4();
    }
    return headerValue || uuidv4();
  }

  private formatLog(metadata: LogMetadata): string {
    return JSON.stringify(metadata, null, 2);
  }
}
