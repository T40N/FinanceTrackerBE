import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { Category } from './category.entity';
import { DataSource } from 'typeorm';
import { CreateCategoryDto } from './dtos/create-category.dto';
import { CategoryFactory } from './category.factory';
import { AbstractService } from 'src/abstract/abstract.service';

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
