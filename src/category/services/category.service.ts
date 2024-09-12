import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { AbstractService } from 'src/abstract/services/abstract.service';
import { DataSource } from 'typeorm';
import { Category } from '../entities/category.entity';
import { CreateCategoryDto } from '../dtos/create-category.dto';
import { CategoryFactory } from '../factories/category.factory';

@Injectable()
export class CategoryService extends AbstractService<
  Category,
  CreateCategoryDto
> {
  constructor(
    @InjectDataSource() dataSource: DataSource,
    private categoryFactory: CategoryFactory,
  ) {
    super(Category, dataSource, categoryFactory, 'Category');
  }

  async findByName(name: string): Promise<Category[]> {
    return this.repository.find({
      where: { name },
    });
  }
}
