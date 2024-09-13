import { Test } from '@nestjs/testing';
import { CategoryController } from '../controllers/category.controller';
import { CategoryService } from './category.service';
import { CategoryFactory } from '../factories/category.factory';
import { getRepositoryMock } from 'src/abstract/definitions/repository.mock';
import { Category } from '../entities/category.entity';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';

describe('CategoryService', () => {
  let categoryService: CategoryService;
  let categoryRepository: Repository<Category>;

  const categoriesMock: Category[] = [
    {
      id: 'some-uuid1',
      name: 'Category 1',
      expenses: [],
      created_at: new Date(),
    },
    {
      id: 'some-uuid2',
      name: 'Category 2',
      expenses: [],
      created_at: new Date(),
    },
  ];

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      controllers: [CategoryController],
      providers: [
        CategoryService,
        CategoryFactory,
        getRepositoryMock(Category),
      ],
    }).compile();

    categoryService = moduleRef.get<CategoryService>(CategoryService);
    categoryRepository = moduleRef.get<Repository<Category>>(
      getRepositoryToken(Category),
    );
  });

  describe('definition', () => {
    it('should be defined', () => {
      expect(categoryService).toBeDefined();
    });

    it('repository should be defined', () => {
      expect(categoryRepository).toBeDefined();
    });
  });

  describe('findByName', () => {
    it('should return an array of categories', async () => {
      jest
        .spyOn(categoryRepository, 'find')
        .mockImplementation(() => Promise.resolve(categoriesMock));

      expect(await categoryService.findByName('Category 1')).toBe(
        categoriesMock,
      );
    });
  });
});
