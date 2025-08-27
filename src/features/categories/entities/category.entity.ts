import { Entity, Column, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { BaseEntity } from '../../../database/entities/base.entity';

@Entity('categories')
export class Category extends BaseEntity {
  @Column({ type: 'uuid', nullable: true })
  parent_id: string;

  @Column({ length: 100 })
  name_en: string;

  @Column({ length: 100 })
  name_tr: string;

  @ManyToOne(() => Category, { nullable: true })
  @JoinColumn({ name: 'parent_id' })
  parent: Category;

  @OneToMany(() => Category, (category) => category.parent)
  children: Category[];
}
