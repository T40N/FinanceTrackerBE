import { NotFoundException } from '@nestjs/common';
import { Expense } from '../entities/expense.entity';
import { CreateExpenseDto } from '../dtos/create-expense.dto';
import { CategoryService } from 'src/category/services/category.service';
import { AbstractFactory } from 'src/abstract/factories/abstract.factory';

export class ExpenseFactory
  implements AbstractFactory<Expense, CreateExpenseDto>
{
  constructor(private readonly categoryService: CategoryService) {}

  async fromDto(createExpenseDto: CreateExpenseDto): Promise<Expense> {
    const expense = new Expense();
    expense.title = createExpenseDto.title;
    expense.description = createExpenseDto.description;
    expense.cost = createExpenseDto.cost;
    expense.date = createExpenseDto.date;

    if (createExpenseDto.categoriesIds.length > 0) {
      const categories = await this.categoryService.findByIds(
        createExpenseDto.categoriesIds,
      );

      if (categories.length !== createExpenseDto.categoriesIds.length) {
        throw new NotFoundException('One or more categories not found');
      }

      expense.categories = categories;
    }

    return expense;
  }
}
