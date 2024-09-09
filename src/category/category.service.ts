import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Category } from './category.entity';
import { Repository } from 'typeorm';
import { Expense } from 'src/expense/expense.entity';

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(Category)
    private categoryRepository: Repository<Category>,
  ) {}

  async findAll(): Promise<Category[]> {
    return this.categoryRepository.find();
  }

  async findById(id: string): Promise<Category> {
    return this.categoryRepository.findOne({
      where: { id },
    });
  }

  async findByName(name: string): Promise<Category[]> {
    return this.categoryRepository.find({
      where: { name },
    });
  }

  async save(category: Category): Promise<Category> {
    return this.categoryRepository.save(category);
  }

  async addExpense(category_id: string, expense: Expense): Promise<Category> {
    const category = await this.findById(category_id);
    if (!category) {
      throw new Error('Category not found');
    }
    category.expenses.push(expense);
    return this.categoryRepository.save(category);
  }

  async delete(id: string): Promise<void> {
    await this.categoryRepository.delete(id);
  }
}
