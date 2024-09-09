import { ExpenseFactory } from 'src/expense/expense.factory';
import { Category } from './category.entity';
import { CreateCategoryDto } from './dtos/create-category.dto';

export class CategoryFactory {
  constructor(private readonly expenseFactory: ExpenseFactory) {}

  fromDto(createCategoryDto: CreateCategoryDto): Category {
    const category = new Category();
    category.name = createCategoryDto.name;
    category.expenses = createCategoryDto.expenses.map((expense) =>
      this.expenseFactory.fromDto(expense),
    );
    return category;
  }
}
