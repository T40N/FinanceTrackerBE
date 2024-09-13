import { Test } from '@nestjs/testing';
import { Category } from '../entities/category.entity';
import { CategoryFactory } from './category.factory';
import { getRepositoryMock } from 'src/abstract/definitions/repository.mock';
import { CreateCategoryDto } from '../dtos/create-category.dto';

describe('CategoryFactory', () => {
  let categoryFactory: CategoryFactory;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [getRepositoryMock(Category), CategoryFactory],
    }).compile();

    categoryFactory = moduleRef.get<CategoryFactory>(CategoryFactory);
  });

  describe('fromDto', () => {
    it('should return a category', async () => {
      const createCategoryDto: CreateCategoryDto = {
        name: 'Category 1',
      };

      const mockCategory = new Category();
      mockCategory.name = 'Category 1';

      const category = await categoryFactory.fromDto(createCategoryDto);

      expect(category).toEqual(mockCategory);
    });
  });
});
