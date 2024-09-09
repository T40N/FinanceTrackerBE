import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Category } from './category.entity';
import { In, Repository } from 'typeorm';
import { Expense } from 'src/expense/expense.entity';
import { CreateCategoryDto } from './dtos/create-category.dto';
import { CategoryFactory } from './category.factory';

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(Category)
    private categoryRepository: Repository<Category>,
    private categoryFactory: CategoryFactory,
  ) {}

  async findAll(): Promise<Category[]> {
    return this.categoryRepository.find();
  }

  async findById(id: string): Promise<Category> {
    return this.categoryRepository.findOne({
      where: { id },
    });
  }

  async findByIds(ids: string[]): Promise<Category[]> {
    return this.categoryRepository.findBy({ id: In(ids) });
  }

  async findByName(name: string): Promise<Category[]> {
    return this.categoryRepository.find({
      where: { name },
    });
  }

  async create(createCategoryDto: CreateCategoryDto): Promise<Category> {
    const category = await this.categoryFactory.fromDto(createCategoryDto);
    return this.categoryRepository.save(category);
  }

  async update(
    id: string,
    createCategoryDto: CreateCategoryDto,
  ): Promise<Category> {
    const category = await this.categoryFactory.fromDto(createCategoryDto);
    category.id = id;
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
