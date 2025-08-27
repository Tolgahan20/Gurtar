import {
  Injectable,
  NestMiddleware,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { NextFunction, Response } from 'express';
import Redis from 'ioredis';
import { AuthenticatedRequest } from '../interfaces/authenticated-request.interface';

interface RateLimitOptions {
  points: number; // Number of requests
  duration: number; // Time window in seconds
  blockDuration?: number; // How long to block if limit exceeded (seconds)
}

interface RateLimitHeaders {
  limit: number;
  remaining: number;
  reset: number;
}

@Injectable()
export class RateLimitMiddleware implements NestMiddleware {
  constructor(
    private readonly redis: Redis,
    private readonly options: RateLimitOptions,
  ) {}

  async use(
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    const key = this.getKey(req);

    try {
      // Check if IP is blocked
      const isBlocked = await this.redis.get(`blocked:${key}`);
      if (isBlocked) {
        throw new HttpException(
          'Too many requests',
          HttpStatus.TOO_MANY_REQUESTS,
        );
      }

      // Get current count
      const current = await this.redis.get(key);

      if (!current) {
        // First request, set initial count
        await this.redis.setex(key, this.options.duration, '1');
        this.setHeaders(res, {
          limit: this.options.points,
          remaining: this.options.points - 1,
          reset: Date.now() + this.options.duration * 1000,
        });
        return next();
      }

      const count = parseInt(current, 10);

      if (count >= this.options.points) {
        // Limit exceeded
        if (this.options.blockDuration) {
          // Block the IP
          await this.redis.setex(
            `blocked:${key}`,
            this.options.blockDuration,
            '1',
          );
        }

        throw new HttpException(
          'Too many requests',
          HttpStatus.TOO_MANY_REQUESTS,
        );
      }

      // Increment count
      await this.redis.incr(key);

      this.setHeaders(res, {
        limit: this.options.points,
        remaining: this.options.points - count - 1,
        reset: Date.now() + this.options.duration * 1000,
      });

      next();
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      next(error);
    }
  }

  private getKey(req: AuthenticatedRequest): string {
    // Use IP and endpoint as key
    const ip = req.ip || req.connection.remoteAddress || 'unknown';
    const endpoint = req.originalUrl;
    return `rate_limit:${ip}:${endpoint}`;
  }

  private setHeaders(res: Response, headers: RateLimitHeaders): void {
    res.setHeader('X-RateLimit-Limit', headers.limit);
    res.setHeader('X-RateLimit-Remaining', headers.remaining);
    res.setHeader('X-RateLimit-Reset', headers.reset);
  }
}
