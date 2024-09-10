import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityMetadata, In, Raw, Repository } from 'typeorm';
import { Expense } from './expense.entity';
import { CreateExpenseDto } from './dtos/create-expense.dto';
import { ExpenseFactory } from './expense.factory';
import { CategoryService } from 'src/category/category.service';

@Injectable()
export class ExpenseService {
  constructor(
    @InjectRepository(Expense)
    private expenseRepository: Repository<Expense>,
    private expenseFactory: ExpenseFactory,
    private categoryService: CategoryService,
  ) {}

  async findAll(): Promise<Expense[]> {
    // Pobieramy metadane encji Expense
    const metadata: EntityMetadata =
      this.expenseRepository.manager.connection.getMetadata(Expense);

    // Wyciągamy nazwy wszystkich relacji
    const relations = metadata.relations.map(
      (relation) => relation.propertyPath,
    );

    // Wykonujemy zapytanie z dynamicznie wygenerowaną listą relacji
    return this.expenseRepository.find({ relations });
  }

  async findById(id: string): Promise<Expense> {
    return this.expenseRepository.findOne({
      where: { id },
    });
  }

  async findByIds(ids: string[]): Promise<Expense[]> {
    return this.expenseRepository.findBy({ id: In(ids) });
  }

  async findByYear(date: Date): Promise<Expense[]> {
    const year = date.getFullYear();

    return this.expenseRepository.find({
      where: {
        date: Raw((alias) => `EXTRACT(YEAR FROM ${alias}) = ${year}`),
      },
    });
  }

  async findByYearAndMonth(date: Date): Promise<Expense[]> {
    const year = date.getFullYear();
    const month = date.getMonth() + 1;

    return this.expenseRepository.find({
      where: {
        date: Raw(
          (alias) =>
            `EXTRACT(YEAR FROM ${alias}) = ${year} AND EXTRACT(MONTH FROM ${alias}) = ${month}`,
        ),
      },
    });
  }

  async findByYearMonthAndDay(date: Date): Promise<Expense[]> {
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();

    return this.expenseRepository.find({
      where: {
        date: Raw(
          (alias) =>
            `EXTRACT(YEAR FROM ${alias}) = ${year} AND EXTRACT(MONTH FROM ${alias}) = ${month} AND EXTRACT(DAY FROM ${alias}) = ${day}`,
        ),
      },
    });
  }

  async create(createExpenseDto: CreateExpenseDto): Promise<Expense> {
    const expense = await this.expenseFactory.fromDto(createExpenseDto);
    return this.expenseRepository.save(expense);
  }

  async update(
    id: string,
    updateExpenseDto: Partial<CreateExpenseDto>,
  ): Promise<Expense> {
    const expenseToUpdate = await this.findById(id);
    if (!expenseToUpdate) {
      throw new NotFoundException('Expense not found');
    }

    Object.assign(expenseToUpdate, updateExpenseDto);
    return this.expenseRepository.save(expenseToUpdate);
  }

  async addCategory(id: string, categoryId: string): Promise<Expense> {
    const expenseToUpdate = await this.expenseRepository.findOne({
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

    return this.expenseRepository.save(expenseToUpdate);
  }

  async delete(id: string): Promise<void> {
    await this.expenseRepository.delete(id);
  }
}
