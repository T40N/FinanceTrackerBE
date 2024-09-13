import { Test } from '@nestjs/testing';
import { Category } from '../entities/category.entity';
import { CategoryController } from './category.controller';
import { CategoryService } from '../services/category.service';
import { CategoryFactory } from '../factories/category.factory';
import { NotFoundException } from '@nestjs/common';
import { getRepositoryMock } from 'src/abstract/definitions/repository.mock';

describe('CategoryController', () => {
  let categoryController: CategoryController;
  let categoryService: CategoryService;

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
        getRepositoryMock(Category),
        CategoryFactory,
      ],
    }).compile();

    categoryService = moduleRef.get<CategoryService>(CategoryService);
    categoryController = moduleRef.get<CategoryController>(CategoryController);
  });

  describe('findAll', () => {
    it('should return an array of categories', async () => {
      jest
        .spyOn(categoryService, 'findAll')
        .mockImplementation(() => Promise.resolve(categoriesMock));

      expect(await categoryController.findAll()).toBe(categoriesMock);
    });

    it('should return an empty array', async () => {
      jest
        .spyOn(categoryService, 'findAll')
        .mockImplementation(() => Promise.resolve([]));

      expect(await categoryController.findAll()).toEqual([]);
    });
  });

  describe('findOne', () => {
    it('should return a category', async () => {
      jest
        .spyOn(categoryService, 'findById')
        .mockImplementation(() => Promise.resolve(categoriesMock[0]));

      expect(await categoryController.findOne('some-uuid1')).toBe(
        categoriesMock[0],
      );
    });

    it('should return a exception', async () => {
      jest
        .spyOn(categoryService, 'findById')
        .mockImplementation(() => Promise.reject(new NotFoundException()));

      await expect(
        categoryController.findOne('some-non-existing-id'),
      ).rejects.toThrow();
    });
  });

  describe('findByName', () => {
    it('should return an array of categories', async () => {
      jest
        .spyOn(categoryService, 'findByName')
        .mockImplementation(() => Promise.resolve([categoriesMock[0]]));

      expect(await categoryController.findByName('Category 1')).toStrictEqual([
        categoriesMock[0],
      ]);
    });

    it('should return an empty array', async () => {
      jest
        .spyOn(categoryService, 'findByName')
        .mockImplementation(() => Promise.resolve([]));

      expect(
        await categoryController.findByName('Non existing Category'),
      ).toEqual([]);
    });
  });

  describe('create', () => {
    it('should return a category', async () => {
      const createCategoryDto = {
        name: 'Category 1',
      };

      jest
        .spyOn(categoryService, 'create')
        .mockImplementation(() => Promise.resolve(categoriesMock[0]));

      expect(await categoryController.create(createCategoryDto)).toBe(
        categoriesMock[0],
      );
    });
  });

  describe('update', () => {
    it('should return a category', async () => {
      const updateCategoryDto = {
        name: 'Category 1',
      };

      jest
        .spyOn(categoryService, 'update')
        .mockImplementation(() => Promise.resolve(categoriesMock[0]));

      expect(
        await categoryController.update('some-uuid1', updateCategoryDto),
      ).toBe(categoriesMock[0]);
    });

    it('should return a exception', async () => {
      const updateCategoryDto = {
        name: 'Category 1',
      };

      jest
        .spyOn(categoryService, 'update')
        .mockImplementation(() => Promise.reject(new NotFoundException()));

      await expect(
        categoryController.update('some-non-existing-id', updateCategoryDto),
      ).rejects.toThrow();
    });
  });

  describe('delete', () => {
    it('should return void', async () => {
      jest
        .spyOn(categoryService, 'delete')
        .mockImplementation(() => Promise.resolve());

      expect(await categoryController.delete('some-uuid1')).toBeUndefined();
    });

    it('should return a exception', async () => {
      jest
        .spyOn(categoryService, 'delete')
        .mockImplementation(() => Promise.reject(new NotFoundException()));

      await expect(
        categoryController.delete('some-non-existing-id'),
      ).rejects.toThrow();
    });
  });
});
