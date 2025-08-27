import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from '../../../database/entities/base.entity';
import { Wallet } from './wallet.entity';

export enum TransactionType {
  DEPOSIT = 'deposit',
  WITHDRAWAL = 'withdrawal',
  REFUND = 'refund',
  COMPENSATION = 'compensation',
  PENALTY = 'penalty',
  PAYOUT = 'payout',
  ORDER_PAYMENT = 'order_payment',
}

@Entity('wallet_transactions')
export class WalletTransaction extends BaseEntity {
  @Column({ type: 'uuid' })
  wallet_id: string;

  @Column({
    type: 'enum',
    enum: TransactionType,
  })
  type: TransactionType;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  amount: number;

  @Column({ type: 'uuid', nullable: true })
  reference_id: string;

  @Column({ type: 'text' })
  description: string;

  @ManyToOne(() => Wallet)
  @JoinColumn({ name: 'wallet_id' })
  wallet: Wallet;
}
