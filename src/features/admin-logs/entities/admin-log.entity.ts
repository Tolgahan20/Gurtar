import { Entity, Column } from 'typeorm';
import { BaseEntity } from '../../../database/entities/base.entity';

export enum TargetType {
  USER = 'user',
  BUSINESS = 'business',
  ORDER = 'order',
  PRODUCT = 'product',
  CAMPAIGN = 'campaign',
}

@Entity('admin_logs')
export class AdminLog extends BaseEntity {
  @Column({ type: 'uuid' })
  admin_id: string;

  @Column({ type: 'text' })
  action: string;

  @Column({
    type: 'enum',
    enum: TargetType,
  })
  target_type: TargetType;

  @Column({ type: 'uuid' })
  target_id: string;
}
