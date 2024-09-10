import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Category } from './category.entity';
import { EntityMetadata, In, Repository } from 'typeorm';
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
    const metadata: EntityMetadata =
      this.categoryRepository.manager.connection.getMetadata(Category);

    // Wyciągamy nazwy wszystkich relacji
    const relations = metadata.relations.map(
      (relation) => relation.propertyPath,
    );

    // Wykonujemy zapytanie z dynamicznie wygenerowaną listą relacji
    return this.categoryRepository.find({ relations });
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
    updateCategoryDto: Partial<CreateCategoryDto>,
  ): Promise<Category> {
    const categoryToUpdate = await this.findById(id);
    if (!categoryToUpdate) {
      throw new NotFoundException(`Category of id: ${id} not found`);
    }

    Object.assign(categoryToUpdate, updateCategoryDto);
    return this.categoryRepository.save(categoryToUpdate);
  }

  async delete(id: string): Promise<void> {
    await this.categoryRepository.delete(id);
  }
}
