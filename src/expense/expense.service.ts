import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource, Raw } from 'typeorm';
import { Expense } from './expense.entity';
import { ExpenseFactory } from './expense.factory';
import { CategoryService } from 'src/category/category.service';
import { AbstractService } from 'src/abstract/abstract.service';
import { CreateExpenseDto } from './dtos/create-expense.dto';

@Injectable()
export class ExpenseService extends AbstractService<Expense, CreateExpenseDto> {
  constructor(
    @InjectDataSource() dataSource: DataSource,
    private expenseFactory: ExpenseFactory,
    private categoryService: CategoryService,
  ) {
    super(Expense, dataSource, expenseFactory, 'Expense');
  }

  async findByYear(year: string): Promise<Expense[]> {
    return this.repository.find({
      where: {
        date: Raw((alias) => `EXTRACT(YEAR FROM ${alias}) = ${year}`),
      },
    });
  }

  async findByYearAndMonth(year: string, month: string): Promise<Expense[]> {
    return this.repository.find({
      where: {
        date: Raw(
          (alias) =>
            `EXTRACT(YEAR FROM ${alias}) = ${year} AND EXTRACT(MONTH FROM ${alias}) = ${month}`,
        ),
      },
    });
  }

  async findByYearMonthAndDay(
    year: string,
    month: string,
    day: string,
  ): Promise<Expense[]> {
    return this.repository.find({
      where: {
        date: Raw(
          (alias) =>
            `EXTRACT(YEAR FROM ${alias}) = ${year} AND EXTRACT(MONTH FROM ${alias}) = ${month} AND EXTRACT(DAY FROM ${alias}) = ${day}`,
        ),
      },
    });
  }

  async addCategory(id: string, categoryId: string): Promise<Expense> {
    const expenseToUpdate = await this.repository.findOne({
      where: { id: id },
      relations: ['categories'], // Ładowanie relacji kategorii
    });
    if (!expenseToUpdate) {
      throw new NotFoundException(`Expense of id: ${id} not found`);
    }

    const category = await this.categoryService.findById(categoryId);

    if (!category) {
      throw new NotFoundException(`Category of id: ${categoryId} not found`);
    }

    if (!expenseToUpdate.categories.some((c) => c.id === categoryId)) {
      expenseToUpdate.categories.push(category);
    }

    return this.repository.save(expenseToUpdate);
  }
}
