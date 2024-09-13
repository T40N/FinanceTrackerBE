import { Test } from '@nestjs/testing';
import { Expense } from '../entities/expense.entity';
import { ExpenseService } from '../services/expense.service';
import { ExpenseController } from './expense.controller';
import { getRepositoryMock } from 'src/abstract/definitions/repository.mock';
import { ExpenseFactory } from '../factories/expense.factory';
import { CategoryService } from 'src/category/services/category.service';
import { NotFoundException } from '@nestjs/common';
import { Category } from 'src/category/entities/category.entity';
import { CategoryFactory } from 'src/category/factories/category.factory';

describe('ExpenseController', () => {
  let expenseController: ExpenseController;
  let expenseService: ExpenseService;

  const expensesMock: Expense[] = [
    {
      id: 'some-uuid1',
      title: 'Expense 1',
      description: 'Expense 1',
      cost: 100,
      categories: [],
      date: new Date(),
      created_at: new Date(),
    },
    {
      id: 'some-uuid2',
      title: 'Expense 2',
      description: 'Expense 2',
      cost: 50,
      categories: [
        {
          id: 'category-uuid1',
          name: 'Category 1',
          expenses: [],
          created_at: new Date(),
        },
      ],
      date: new Date(),
      created_at: new Date(),
    },
  ];

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      controllers: [ExpenseController],
      providers: [
        ExpenseService,
        getRepositoryMock(Expense),
        getRepositoryMock(Category),
        CategoryFactory,
        ExpenseFactory,
        CategoryService,
      ],
    }).compile();

    expenseService = moduleRef.get<ExpenseService>(ExpenseService);
    expenseController = moduleRef.get<ExpenseController>(ExpenseController);
  });

  describe('findAll', () => {
    it('should return an array of expenses', async () => {
      jest
        .spyOn(expenseService, 'findAll')
        .mockImplementation(() => Promise.resolve(expensesMock));

      expect(await expenseController.findAll()).toBe(expensesMock);
    });

    it('should return an empty array', async () => {
      jest
        .spyOn(expenseService, 'findAll')
        .mockImplementation(() => Promise.resolve([]));

      expect(await expenseController.findAll()).toEqual([]);
    });
  });

  describe('findOne', () => {
    it('should return an expense', async () => {
      jest
        .spyOn(expenseService, 'findById')
        .mockImplementation(() => Promise.resolve(expensesMock[0]));

      expect(await expenseController.findOne('some-uuid1')).toBe(
        expensesMock[0],
      );
    });

    it('should return an expense with categories', async () => {
      jest
        .spyOn(expenseService, 'findById')
        .mockImplementation(() => Promise.resolve(expensesMock[1]));

      expect(await expenseController.findOne('some-uuid2')).toBe(
        expensesMock[1],
      );
    });

    it('should return an error', async () => {
      jest
        .spyOn(expenseService, 'findById')
        .mockImplementation(() => Promise.reject(new NotFoundException()));

      expect(expenseController.findOne('some-uuid3')).rejects.toThrow();
    });
  });

  describe('findByYear', () => {
    it('should return an array of expenses', async () => {
      const resoult = expensesMock.filter(
        (expense) =>
          expense.date.getFullYear().toString() ===
          new Date().getFullYear().toString(),
      );
      jest
        .spyOn(expenseService, 'findByYear')
        .mockImplementation(() => Promise.resolve(resoult));

      expect(
        await expenseController.findByYear(new Date().getFullYear.toString()),
      ).toBe(resoult);
    });
  });

  describe('findByYearAndMonth', () => {
    it('should return an array of expenses', async () => {
      const resoult = expensesMock.filter(
        (expense) =>
          expense.date.getFullYear().toString() ===
            new Date().getFullYear().toString() &&
          expense.date.getMonth().toString() ===
            new Date().getMonth().toString(),
      );
      jest
        .spyOn(expenseService, 'findByYearAndMonth')
        .mockImplementation(() => Promise.resolve(resoult));

      expect(
        await expenseController.findByYearAndMonth(
          new Date().getFullYear.toString(),
          new Date().getMonth.toString(),
        ),
      ).toBe(resoult);
    });
  });

  describe('findByYearMonthAndDay', () => {
    it('should return an array of expenses', async () => {
      const resoult = expensesMock.filter(
        (expense) =>
          expense.date.getFullYear().toString() ===
            new Date().getFullYear().toString() &&
          expense.date.getMonth().toString() ===
            new Date().getMonth().toString() &&
          expense.date.getDate().toString() === new Date().getDate().toString(),
      );
      jest
        .spyOn(expenseService, 'findByYearMonthAndDay')
        .mockImplementation(() => Promise.resolve(resoult));

      expect(
        await expenseController.findByYearMonthAndDay(
          new Date().getFullYear.toString(),
          new Date().getMonth.toString(),
          new Date().getDate.toString(),
        ),
      ).toBe(resoult);
    });
  });

  describe('create', () => {
    it('should return an expense', async () => {
      const createExpenseDto = {
        title: 'Expense 1',
        description: 'Expense 1',
        cost: 100,
        date: new Date(),
        categoriesIds: [],
      };

      jest
        .spyOn(expenseService, 'create')
        .mockImplementation(() => Promise.resolve(expensesMock[0]));

      expect(await expenseController.create(createExpenseDto)).toBe(
        expensesMock[0],
      );
    });
  });

  describe('update', () => {
    it('should return an expense', async () => {
      const updateExpenseDto = {
        title: 'Expense 1',
        description: 'Expense 1',
        cost: 100,
        date: new Date(),
        categoriesIds: [],
      };

      jest
        .spyOn(expenseService, 'update')
        .mockImplementation(() => Promise.resolve(expensesMock[0]));

      expect(
        await expenseController.update('some-uuid1', updateExpenseDto),
      ).toBe(expensesMock[0]);
    });
  });
});
