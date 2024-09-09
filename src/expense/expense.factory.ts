import { CreateExpenseDto } from './dtos/create-expense.dto';
import { Expense } from './expense.entity';
import { CategoryService } from 'src/category/category.service';

export class ExpenseFactory {
  constructor(private readonly categoryService: CategoryService) {}

  async fromDto(createExpenseDto: CreateExpenseDto): Promise<Expense> {
    const expense = new Expense();
    expense.title = createExpenseDto.title;
    expense.description = createExpenseDto.description;
    expense.cost = createExpenseDto.cost;
    expense.date = createExpenseDto.date;

    expense.categories = await this.categoryService.findByIds(
      createExpenseDto.categoriesIds,
    );

    return expense;
  }
}
