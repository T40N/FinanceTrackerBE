import { Category } from './category.entity';
import { CreateCategoryDto } from './dtos/create-category.dto';
import { ExpenseService } from 'src/expense/expense.service';

export class CategoryFactory {
  constructor(private readonly expenseService: ExpenseService) {}

  async fromDto(createCategoryDto: CreateCategoryDto): Promise<Category> {
    const category = new Category();
    category.name = createCategoryDto.name;

    const expenses = await this.expenseService.findByIds(
      createCategoryDto.expenseIds,
    );

    category.expenses = expenses;

    return category;
  }
}
