import { CategoryFactory } from 'src/category/category.factory';
import { CreateExpenseDto } from './dtos/create-expense.dto';
import { Expense } from './expense.entity';

export class ExpenseFactory {
  constructor(private readonly categoryFactory: CategoryFactory) {}

  fromDto(createExpenseDto: CreateExpenseDto): Expense {
    const expense = new Expense();
    expense.title = createExpenseDto.title;
    expense.description = createExpenseDto.description;
    expense.cost = createExpenseDto.cost;
    expense.date = createExpenseDto.date;
    expense.categories = createExpenseDto.categories.map((category) =>
      this.categoryFactory.fromDto(category),
    );
    return expense;
  }
}
