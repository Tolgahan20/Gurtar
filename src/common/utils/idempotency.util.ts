import { Injectable } from '@nestjs/common';
import Redis from 'ioredis';
import { v4 as uuidv4 } from 'uuid';

interface IdempotencyRecord {
  status: 'processing' | 'completed' | 'failed';
  response?: unknown;
  error?: unknown;
  timestamp: number;
}

@Injectable()
export class IdempotencyService {
  private readonly keyPrefix = 'idempotency:';
  private readonly defaultTTL = 24 * 60 * 60; // 24 hours in seconds

  constructor(private readonly redis: Redis) {}

  /**
   * Check if operation with given key was already processed
   */
  async checkOperation(key: string): Promise<IdempotencyRecord | null> {
    const record = await this.redis.get(this.getKey(key));
    return record ? (JSON.parse(record) as IdempotencyRecord) : null;
  }

  /**
   * Start processing operation with lock
   */
  async startOperation(key: string): Promise<boolean> {
    const record: IdempotencyRecord = {
      status: 'processing',
      timestamp: Date.now(),
    };

    // Try to set key only if it doesn't exist
    const result = await this.redis.set(
      this.getKey(key),
      JSON.stringify(record),
      'EX',
      this.defaultTTL,
      'NX',
    );

    return result === 'OK';
  }

  /**
   * Complete operation with result
   */
  async completeOperation(key: string, response: unknown): Promise<void> {
    const record: IdempotencyRecord = {
      status: 'completed',
      response,
      timestamp: Date.now(),
    };

    await this.redis.set(
      this.getKey(key),
      JSON.stringify(record),
      'EX',
      this.defaultTTL,
    );
  }

  /**
   * Mark operation as failed
   */
  async failOperation(key: string, error: unknown): Promise<void> {
    const record: IdempotencyRecord = {
      status: 'failed',
      error,
      timestamp: Date.now(),
    };

    await this.redis.set(
      this.getKey(key),
      JSON.stringify(record),
      'EX',
      this.defaultTTL,
    );
  }

  /**
   * Generate new idempotency key
   */
  generateKey(): string {
    return uuidv4();
  }

  private getKey(key: string): string {
    return `${this.keyPrefix}${key}`;
  }
}
