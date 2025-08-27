import { Entity, Column, Index } from 'typeorm';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { BaseEntity } from '../../../database/entities/base.entity';

export enum LoginType {
  NORMAL = 'normal',
  GOOGLE = 'google',
  FACEBOOK = 'facebook',
}

export enum Gender {
  MALE = 'male',
  FEMALE = 'female',
  OTHER = 'other',
  PREFER_NOT_SAY = 'prefer_not_say',
}

@Entity('users')
@Index(['email'], { unique: true })
@Index(['phone'], { unique: true })
export class User extends BaseEntity {
  @ApiProperty({ description: 'User first name' })
  @Column({ length: 100 })
  name: string;

  @ApiProperty({ description: 'User last name' })
  @Column({ length: 100 })
  surname: string;

  @ApiProperty({ description: 'User email address' })
  @Column({ length: 255, unique: true })
  email: string;

  @ApiProperty({ description: 'User phone number' })
  @Column({ length: 20, unique: true })
  phone: string;

  @ApiPropertyOptional({
    description: 'Hashed password (null if social login)',
  })
  @Column({ length: 255, nullable: true })
  password_hash: string;

  @ApiProperty({ description: 'Login type', enum: LoginType })
  @Column({
    type: 'enum',
    enum: LoginType,
    default: LoginType.NORMAL,
  })
  login_type: LoginType;

  @ApiPropertyOptional({ description: 'User gender', enum: Gender })
  @Column({
    type: 'enum',
    enum: Gender,
    nullable: true,
  })
  gender?: Gender;

  @ApiPropertyOptional({ description: 'User birthday' })
  @Column({ type: 'date', nullable: true })
  birthday?: Date;

  @ApiPropertyOptional({ description: 'User allergies list' })
  @Column({ type: 'text', array: true, nullable: true })
  allergies?: string[];

  // Virtual property for full name
  get fullName(): string {
    return `${this.name} ${this.surname}`;
  }
}
