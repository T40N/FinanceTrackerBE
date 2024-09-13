import { DeepPartial, Repository } from 'typeorm';
import { ExpenseService } from './expense.service';
import { Expense } from '../entities/expense.entity';
import { getRepositoryMock } from 'src/abstract/definitions/repository.mock';
import { ExpenseFactory } from '../factories/expense.factory';
import { CategoryService } from 'src/category/services/category.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Test } from '@nestjs/testing';
import { Category } from 'src/category/entities/category.entity';
import { CategoryFactory } from 'src/category/factories/category.factory';
import { NotFoundException } from '@nestjs/common';

describe('ExpenseService', () => {
  let expenseService: ExpenseService;
  let expenseRepository: Repository<Expense>;
  let categoryService: CategoryService;

  const expensesMock: Expense[] = [
    {
      id: 'some-uuid1',
      title: 'Expense 1',
      description: 'Expense 1',
      cost: 100,
      date: new Date(),
      categories: [],
      created_at: new Date(),
    },
    {
      id: 'some-uuid2',
      title: 'Expense 2',
      description: 'Expense 2',
      cost: 200,
      date: new Date(),
      categories: [],
      created_at: new Date(),
    },
  ];

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        ExpenseService,
        getRepositoryMock(Expense),
        getRepositoryMock(Category),
        ExpenseFactory,
        CategoryFactory,
        CategoryService,
      ],
    }).compile();

    expenseService = moduleRef.get<ExpenseService>(ExpenseService);
    expenseRepository = moduleRef.get<Repository<Expense>>(
      getRepositoryToken(Expense),
    );
    categoryService = moduleRef.get<CategoryService>(CategoryService);
  });

  describe('definition', () => {
    it('should be defined', () => {
      expect(expenseService).toBeDefined();
    });

    it('repository should be defined', () => {
      expect(expenseRepository).toBeDefined();
    });
  });

  describe('findByYear', () => {
    it('should return an array of expenses', async () => {
      jest
        .spyOn(expenseRepository, 'find')
        .mockImplementation(() => Promise.resolve(expensesMock));

      const expenses = await expenseService.findByYear('2021');

      expect(expenses).toStrictEqual(expensesMock);
    });
  });

  describe('findByYearAndMonth', () => {
    it('should return an array of expenses', async () => {
      jest
        .spyOn(expenseRepository, 'find')
        .mockImplementation(() => Promise.resolve(expensesMock));

      const expenses = await expenseService.findByYearAndMonth('2021', '01');

      expect(expenses).toStrictEqual(expensesMock);
    });
  });

  describe('findByYearMonthAndDay', () => {
    it('should return an array of expenses', async () => {
      jest
        .spyOn(expenseRepository, 'find')
        .mockImplementation(() => Promise.resolve(expensesMock));

      const expenses = await expenseService.findByYearMonthAndDay(
        '2021',
        '01',
        '01',
      );

      expect(expenses).toStrictEqual(expensesMock);
    });
  });

  describe('addCategory', () => {
    it('should return an expense', async () => {
      const mockExpense = {
        id: 'some-uuid1',
        title: 'Expense 1',
        description: 'Expense 1',
        cost: 100,
        date: new Date(),
        categories: [],
        created_at: new Date(),
      };

      const resoult = {
        id: 'some-uuid1',
        title: 'Expense 1',
        description: 'Expense 1',
        cost: 100,
        date: new Date(),
        categories: [
          {
            id: 'category-uuid1',
            name: 'Category 1',
            expenses: [],
            created_at: new Date(),
          },
        ],
        created_at: new Date(),
      };

      jest
        .spyOn(expenseRepository, 'findOne')
        .mockResolvedValue(mockExpense as Expense);

      jest.spyOn(categoryService, 'findById').mockResolvedValue({
        id: 'category-uuid1',
        name: 'Category 1',
        expenses: [],
        created_at: new Date(),
      } as Category);

      jest
        .spyOn(expenseRepository, 'save')
        .mockImplementation(
          (expense) =>
            Promise.resolve(expense) as Promise<DeepPartial<Expense> & Expense>,
        );

      const expense = await expenseService.addCategory(
        'some-uuid1',
        'category-uuid1',
      );

      expect(expense).toStrictEqual(resoult);
    });

    it('should throw an error', async () => {
      jest
        .spyOn(expenseRepository, 'findOne')
        .mockImplementation(() =>
          Promise.reject(
            new NotFoundException(`Expense of id: some-uuid1 not found`),
          ),
        );

      await expect(
        expenseService.addCategory('some-uuid1', 'category-uuid1'),
      ).rejects.toThrow(`Expense of id: some-uuid1 not found`);
    });

    it('should throw an error', async () => {
      jest.spyOn(expenseRepository, 'findOne').mockResolvedValue({
        id: 'some-uuid1',
        title: 'Expense 1',
        description: 'Expense 1',
        cost: 100,
        date: new Date(),
        categories: [],
        created_at: new Date(),
      } as Expense);

      jest
        .spyOn(categoryService, 'findById')
        .mockImplementation(() =>
          Promise.reject(
            new NotFoundException(`Category of id: category-uuid1 not found`),
          ),
        );

      await expect(
        expenseService.addCategory('some-uuid1', 'category-uuid1'),
      ).rejects.toThrow(`Category of id: category-uuid1 not found`);
    });
  });
});
