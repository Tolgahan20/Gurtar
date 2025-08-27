import { Entity, Column } from 'typeorm';
import { BaseEntity } from '../../../database/entities/base.entity';

export enum OwnerType {
  USER = 'user',
  BUSINESS = 'business',
}

@Entity('wallets')
export class Wallet extends BaseEntity {
  @Column({
    type: 'enum',
    enum: OwnerType,
  })
  owner_type: OwnerType;

  @Column({ type: 'uuid' })
  owner_id: string;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  balance: number;

  @Column({ type: 'char', length: 3, default: 'EUR' })
  currency: string;
}
