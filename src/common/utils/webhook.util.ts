import { createHmac, timingSafeEqual } from 'crypto';
import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class WebhookService {
  private readonly logger = new Logger(WebhookService.name);

  /**
   * Verify webhook signature
   */
  verifySignature(
    payload: string,
    signature: string,
    secret: string,
    algorithm: string = 'sha256',
  ): boolean {
    try {
      const hmac = createHmac(algorithm, secret);
      const expectedSignature = hmac.update(payload).digest('hex');

      return timingSafeEqual(
        Buffer.from(signature),
        Buffer.from(expectedSignature),
      );
    } catch (error) {
      this.logger.error('Webhook signature verification failed', error);
      return false;
    }
  }

  /**
   * Process webhook with retries
   */
  async processWebhookWithRetries<T>(
    processor: () => Promise<T>,
    maxRetries = 3,
    initialDelay = 1000,
  ): Promise<T> {
    let currentAttempt = 1;
    let currentDelay = initialDelay;
    let error: Error | null = null;

    while (currentAttempt <= maxRetries) {
      try {
        return await processor();
      } catch (err) {
        error = err instanceof Error ? err : new Error(String(err));
        this.logger.warn(
          `Webhook processing attempt ${currentAttempt} failed: ${error.message}`,
        );

        if (currentAttempt < maxRetries) {
          await new Promise((resolve) => setTimeout(resolve, currentDelay));
          currentDelay *= 2; // Exponential backoff
          currentAttempt += 1;
        }
      }
    }

    throw error || new Error('Webhook processing failed');
  }

  /**
   * Validate webhook timestamp
   */
  isTimestampValid(
    timestamp: number,
    toleranceSeconds = 300, // 5 minutes
  ): boolean {
    const now = Math.floor(Date.now() / 1000);
    return Math.abs(now - timestamp) <= toleranceSeconds;
  }

  /**
   * Generate webhook signature
   */
  generateSignature(
    payload: string,
    secret: string,
    algorithm: string = 'sha256',
  ): string {
    const hmac = createHmac(algorithm, secret);
    return hmac.update(payload).digest('hex');
  }
}
