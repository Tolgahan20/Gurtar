import { Injectable } from '@nestjs/common';

@Injectable()
export class BusinessesService {
  async isOwner(businessId: string, userId: string): Promise<boolean> {
    // TODO: Implement business owner check
    return false;
  }

  async isWorker(businessId: string, userId: string): Promise<boolean> {
    // TODO: Implement worker check
    return false;
  }
}
