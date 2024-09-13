import { Injectable } from '@nestjs/common';
import { Category } from '../entities/category.entity';
import { CreateCategoryDto } from '../dtos/create-category.dto';
import { AbstractFactory } from 'src/abstract/factories/abstract.factory';

@Injectable()
export class CategoryFactory
  implements AbstractFactory<Category, CreateCategoryDto>
{
  constructor() {}

  async fromDto(createCategoryDto: CreateCategoryDto): Promise<Category> {
    const category = new Category();
    category.name = createCategoryDto.name;

    return category;
  }
}
