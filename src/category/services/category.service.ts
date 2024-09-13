import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AbstractService } from 'src/abstract/services/abstract.service';
import { Repository } from 'typeorm';
import { Category } from '../entities/category.entity';
import { CreateCategoryDto } from '../dtos/create-category.dto';
import { CategoryFactory } from '../factories/category.factory';

@Injectable()
export class CategoryService extends AbstractService<
  Category,
  CreateCategoryDto
> {
  constructor(
    @InjectRepository(Category)
    protected readonly repository: Repository<Category>,
    protected readonly factory: CategoryFactory,
  ) {
    super(repository, factory);
  }

  async findByName(name: string): Promise<Category[]> {
    return this.repository.find({
      where: { name },
    });
  }
}
