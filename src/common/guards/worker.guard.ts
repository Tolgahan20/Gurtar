import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { BusinessesService } from '../../features/businesses/businesses.service';
import { AuthenticatedRequest } from '../interfaces/authenticated-request.interface';

@Injectable()
export class WorkerGuard implements CanActivate {
  constructor(private readonly businessesService: BusinessesService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<AuthenticatedRequest>();
    const user = request.user;
    const businessId = request.params.businessId;

    if (!user || !businessId) {
      throw new ForbiddenException('Invalid request');
    }

    const isWorker = await this.businessesService.isWorker(businessId, user.id);

    if (!isWorker) {
      throw new ForbiddenException('Only workers can perform this action');
    }

    return true;
  }
}
