import {
  Injectable,
  NestMiddleware,
  BadRequestException,
} from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { IdempotencyService } from '../utils/idempotency.util';

@Injectable()
export class IdempotencyMiddleware implements NestMiddleware {
  constructor(private readonly idempotencyService: IdempotencyService) {}

  async use(req: Request, res: Response, next: NextFunction) {
    // Only check POST, PUT, PATCH methods
    if (!['POST', 'PUT', 'PATCH'].includes(req.method)) {
      return next();
    }

    const idempotencyKey = req.headers['idempotency-key'] as string;

    // Validate idempotency key if present
    if (idempotencyKey) {
      try {
        const record =
          await this.idempotencyService.checkOperation(idempotencyKey);

        if (record) {
          if (record.status === 'completed') {
            // Return cached response
            return res.status(200).json(record.response);
          } else if (record.status === 'failed') {
            // Return cached error
            return res.status(400).json(record.error);
          } else if (record.status === 'processing') {
            throw new BadRequestException('Operation is already in progress');
          }
        }

        // Start new operation
        const started =
          await this.idempotencyService.startOperation(idempotencyKey);
        if (!started) {
          throw new BadRequestException('Failed to start idempotent operation');
        }

        // Store original send function
        const originalSend = res.send;

        // Override send to cache response
        res.send = function (body: any): Response {
          const response = body;

          // Cache successful response
          if (res.statusCode >= 200 && res.statusCode < 300) {
            this.idempotencyService.completeOperation(idempotencyKey, response);
          } else {
            this.idempotencyService.failOperation(idempotencyKey, response);
          }

          return originalSend.call(this, body);
        };
      } catch (error) {
        return res.status(400).json({
          message: error.message || 'Idempotency check failed',
        });
      }
    }

    next();
  }
}
