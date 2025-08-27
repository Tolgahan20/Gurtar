import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { User } from '../../features/users/entities/user.entity';

export const CurrentUser = createParamDecorator(
  (data: keyof User | undefined, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const user: User = request.user;

    return data ? user?.[data] : user;
  },
);
