import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from '../../../database/entities/base.entity';
import { Business } from './business.entity';

@Entity('workers')
export class Worker extends BaseEntity {
  @Column({ type: 'uuid' })
  business_id: string;

  @Column({ length: 100 })
  name: string;

  @Column({ length: 255 })
  email: string;

  @Column({ length: 20 })
  phone: string;

  @Column({
    type: 'enum',
    enum: ['normal', 'google', 'facebook'],
    default: 'normal',
  })
  login_type: string;

  @ManyToOne(() => Business)
  @JoinColumn({ name: 'business_id' })
  business: Business;
}
