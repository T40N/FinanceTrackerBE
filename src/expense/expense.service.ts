import { Injectable } from '@nestjs/common';
import { Expense } from './interfaces/expense.interface';

@Injectable()
export class ExpenseService {
  private readonly expenses: Expense[] = [];
}
