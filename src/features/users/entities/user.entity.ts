import { Entity, Column } from 'typeorm';
import { BaseEntity } from '../../../database/entities/base.entity';
import { Role } from '../../../common/decorators/roles.decorator';

@Entity('users')
export class User extends BaseEntity {
  @Column()
  email: string;

  @Column()
  name: string;

  @Column()
  surname: string;

  @Column()
  password_hash: string;

  @Column({ type: 'enum', enum: Role, array: true, default: [Role.CUSTOMER] })
  roles: Role[];

  @Column({ nullable: true })
  phone?: string;

  @Column({ default: false })
  email_verified: boolean;

  @Column({ default: false })
  phone_verified: boolean;

  @Column({ nullable: true })
  avatar_url?: string;
}
