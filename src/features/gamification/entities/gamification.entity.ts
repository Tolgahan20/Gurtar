import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from '../../../database/entities/base.entity';
import { User } from '../../users/entities/user.entity';

@Entity('gamification')
export class Gamification extends BaseEntity {
  @Column({ type: 'uuid' })
  user_id: string;

  @Column({ length: 100 })
  badge_name: string;

  @Column({ type: 'int' })
  points: number;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user: User;
}
