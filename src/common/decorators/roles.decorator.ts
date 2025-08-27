import { SetMetadata } from '@nestjs/common';

export enum Role {
  CUSTOMER = 'customer',
  BUSINESS_OWNER = 'business_owner',
  WORKER = 'worker',
  ADMIN = 'admin',
  SUPPORT = 'support',
}

export const ROLES_KEY = 'roles';
export const Roles = (...roles: Role[]) => SetMetadata(ROLES_KEY, roles);
