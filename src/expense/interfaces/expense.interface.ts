import { Category } from '../types/category.type';

export interface Expense {
  id: string;
  title: string;
  description: string;
  amount: number;
  date: Date;
  category: Category;
  created_at: Date;
}
