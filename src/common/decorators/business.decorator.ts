import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Business } from '../../features/businesses/entities/business.entity';

export const CurrentBusiness = createParamDecorator(
  (data: keyof Business | undefined, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const business: Business = request.business;

    return data ? business?.[data] : business;
  },
);
