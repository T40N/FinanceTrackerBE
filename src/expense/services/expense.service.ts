import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Raw, Repository } from 'typeorm';
import { Expense } from '../entities/expense.entity';
import { CreateExpenseDto } from '../dtos/create-expense.dto';
import { AbstractService } from 'src/abstract/services/abstract.service';
import { ExpenseFactory } from '../factories/expense.factory';
import { CategoryService } from 'src/category/services/category.service';

@Injectable()
export class ExpenseService extends AbstractService<Expense, CreateExpenseDto> {
  constructor(
    @InjectRepository(Expense)
    protected readonly repository: Repository<Expense>,
    protected readonly factory: ExpenseFactory,
    private readonly categoryService: CategoryService,
  ) {
    super(repository, factory);
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
