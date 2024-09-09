import {
  Column,
  CreateDateColumn,
  Entity,
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

  @Column()
  category: string;

  @CreateDateColumn({ type: 'timestamptz' })
  created_at: Date;
}
