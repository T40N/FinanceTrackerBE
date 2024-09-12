import { Category } from 'src/category/entities/category.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Expense {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column()
  description: string;

  @Column()
  cost: number;

  @Column()
  date: Date;

  @ManyToMany(() => Category, (category) => category.expenses)
  @JoinTable()
  categories: Category[];

  @CreateDateColumn({ type: 'timestamptz' })
  created_at: Date;
}
