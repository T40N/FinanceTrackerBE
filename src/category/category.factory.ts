import { NotFoundException } from '@nestjs/common';
import { Category } from './category.entity';
import { CreateCategoryDto } from './dtos/create-category.dto';
import { ExpenseService } from 'src/expense/expense.service';
import { AbstractFactory } from 'src/abstract/abstract.factory';

export class CategoryFactory
  implements AbstractFactory<Category, CreateCategoryDto>
{
  constructor(private readonly expenseService: ExpenseService) {}

  async fromDto(createCategoryDto: CreateCategoryDto): Promise<Category> {
    const category = new Category();
    category.name = createCategoryDto.name;

    if (createCategoryDto.expenseIds.length > 0) {
      const expenses = await this.expenseService.findByIds(
        createCategoryDto.expenseIds,
      );

      if (expenses.length !== createCategoryDto.expenseIds.length) {
        throw new NotFoundException('One or more expenses not found');
      }

      category.expenses = expenses;
    }

    return category;
  }
}
