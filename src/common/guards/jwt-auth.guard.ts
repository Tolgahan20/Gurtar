import {
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { JsonWebTokenError } from 'jsonwebtoken';
import { Observable } from 'rxjs';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    return super.canActivate(context);
  }

  handleRequest<TUser = any>(err: any, user: any, info: any): TUser {
    // You can throw an exception based on either "info" or "err" arguments
    if (info instanceof JsonWebTokenError) {
      throw new UnauthorizedException('Invalid or expired token');
    }

    if (err || !user) {
      throw err || new UnauthorizedException();
    }

    return user;
  }
}
