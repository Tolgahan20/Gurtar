import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from '../../../database/entities/base.entity';
import { Order } from '../../orders/entities/order.entity';

export enum PaymentType {
  CASH_REFUND = 'cash_refund',
  WALLET_CREDIT = 'wallet_credit',
}

export enum PaymentStatus {
  PENDING = 'pending',
  APPROVED = 'approved',
  REJECTED = 'rejected',
}

@Entity('payments')
export class Payment extends BaseEntity {
  @Column({ type: 'uuid' })
  payment_id: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  amount: number;

  @Column({
    type: 'enum',
    enum: PaymentType,
  })
  type: PaymentType;

  @Column({
    type: 'enum',
    enum: PaymentStatus,
    default: PaymentStatus.PENDING,
  })
  status: PaymentStatus;

  @ManyToOne(() => Order)
  @JoinColumn({ name: 'payment_id' })
  order: Order;
}
