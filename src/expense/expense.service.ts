import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Raw, Repository } from 'typeorm';
import { Expense } from './entities/expense.entity';

@Injectable()
export class ExpenseService {
  constructor(
    @InjectRepository(Expense) private expenseRepository: Repository<Expense>,
  ) {}

  async findAll(): Promise<Expense[]> {
    return this.expenseRepository.find();
  }

  async findById(id: string): Promise<Expense> {
    return this.expenseRepository.findOne({
      where: { id },
    });
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

  async save(expense: Expense): Promise<Expense> {
    return this.expenseRepository.save(expense);
  }
}
