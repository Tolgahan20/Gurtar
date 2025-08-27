import {
  createParamDecorator,
  ExecutionContext,
  BadRequestException,
} from '@nestjs/common';
import { validate as uuidValidate } from 'uuid';

export const IdempotencyKey = createParamDecorator(
  (options: { required?: boolean } = {}, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const key = request.headers['idempotency-key'];

    if (options.required && !key) {
      throw new BadRequestException('Idempotency-Key header is required');
    }

    // Validate UUID format if key is present
    if (key) {
      try {
        // Validate UUID format
        if (!uuidValidate(key)) {
          throw new Error();
        }
      } catch {
        throw new BadRequestException(
          'Invalid Idempotency-Key format. Must be a valid UUID',
        );
      }
    }

    return key;
  },
);
