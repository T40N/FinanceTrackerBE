import { Expense } from 'src/expense/entities/expense.entity';
import { Entity, PrimaryGeneratedColumn, Column, ManyToMany } from 'typeorm';

@Entity()
export class Category {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @ManyToMany(() => Expense, (expense) => expense.categories)
  expenses: Expense[];

  @Column({ type: 'timestamp' })
  created_at: Date;
}
