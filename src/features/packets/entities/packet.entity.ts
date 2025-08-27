import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from '../../../database/entities/base.entity';
import { Business } from '../../businesses/entities/business.entity';

@Entity('packets')
export class Packet extends BaseEntity {
  @Column({ type: 'uuid' })
  business_id: string;

  @Column({ length: 255 })
  title_en: string;

  @Column({ length: 255 })
  title_tr: string;

  @Column({ type: 'text' })
  description_en: string;

  @Column({ type: 'text' })
  description_tr: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  price: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  original_price: number;

  @Column({ type: 'int' })
  stock: number;

  @Column({ type: 'time' })
  available_from: string;

  @Column({ type: 'time' })
  available_until: string;

  @ManyToOne(() => Business)
  @JoinColumn({ name: 'business_id' })
  business: Business;
}
