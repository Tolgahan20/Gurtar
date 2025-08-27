import { Entity, Column, Index, ManyToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from '../../../database/entities/base.entity';
import { Category } from '../../categories/entities/category.entity';

export enum SubscriptionType {
  FREE_TRIAL = 'free_trial',
  STANDARD = 'standard',
  PREMIUM = 'premium',
}

export enum SubscriptionStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  SUSPENDED = 'suspended',
}

@Entity('businesses')
@Index(['email'], { unique: true })
@Index(['phone'], { unique: true })
@Index(['tax_number'], { unique: true })
export class Business extends BaseEntity {
  @Column({ length: 100 })
  owner_name: string;

  @Column({ length: 100 })
  business_name: string;

  @Column({ length: 255, unique: true })
  email: string;

  @Column({ length: 20, unique: true })
  phone: string;

  @Column({ length: 255 })
  password_hash: string;

  @Column({
    type: 'enum',
    enum: ['normal', 'google', 'facebook'],
    default: 'normal',
  })
  login_type: string;

  @Column({ length: 100, unique: true })
  tax_number: string;

  @Column({
    type: 'enum',
    enum: SubscriptionType,
    default: SubscriptionType.FREE_TRIAL,
  })
  subscription_type: SubscriptionType;

  @Column({
    type: 'enum',
    enum: SubscriptionStatus,
    default: SubscriptionStatus.ACTIVE,
  })
  subscription_status: SubscriptionStatus;

  @Column({ type: 'text' })
  address: string;

  @Column({ type: 'decimal', precision: 10, scale: 7 })
  longitude: number;

  @Column({ type: 'decimal', precision: 10, scale: 7 })
  latitude: number;

  @Column({ type: 'uuid' })
  category_id: string;

  @ManyToOne(() => Category)
  @JoinColumn({ name: 'category_id' })
  category: Category;
}
