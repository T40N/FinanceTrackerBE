import { Expense } from '../entities/expense.entity';
import { CreateExpenseDto } from '../dtos/create-expense.dto';

export class ExpenseFactory {
  fromDto(createExpenseDto: CreateExpenseDto): Expense {
    const expense = new Expense();
    expense.title = createExpenseDto.title;
    expense.description = createExpenseDto.description;
    expense.cost = createExpenseDto.cost;
    expense.date = createExpenseDto.date;
    expense.category = createExpenseDto.category;
    return expense;
  }
}
