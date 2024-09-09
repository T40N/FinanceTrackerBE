import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Raw, Repository } from 'typeorm';
import { Expense } from './expense.entity';
import { CreateExpenseDto } from './dtos/create-expense.dto';
import { ExpenseFactory } from './expense.factory';

@Injectable()
export class ExpenseService {
  constructor(
    @InjectRepository(Expense)
    private expenseRepository: Repository<Expense>,
    private expenseFactory: ExpenseFactory,
  ) {}

  async findAll(): Promise<Expense[]> {
    return this.expenseRepository.find();
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
    createExpenseDto: Partial<CreateExpenseDto>,
  ): Promise<Expense> {
    const expenseToUpdate = await this.findById(id);
    if (!expenseToUpdate) {
      throw new NotFoundException('Expense not found');
    }

    Object.assign(expenseToUpdate, createExpenseDto);
    return this.expenseRepository.save(expenseToUpdate);
  }

  async delete(id: string): Promise<void> {
    await this.expenseRepository.delete(id);
  }
}
