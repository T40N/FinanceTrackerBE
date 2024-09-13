import { Test } from '@nestjs/testing';
import { ExpenseFactory } from './expense.factory';
import { CategoryService } from 'src/category/services/category.service';
import { Expense } from '../entities/expense.entity';
import { Category } from 'src/category/entities/category.entity';
import { getRepositoryMock } from 'src/abstract/definitions/repository.mock';
import { CategoryFactory } from 'src/category/factories/category.factory';

describe('ExpenseFactory', () => {
  let expenseFactory: ExpenseFactory;
  let categoryService: CategoryService;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        ExpenseFactory,
        CategoryService,
        CategoryFactory,
        getRepositoryMock(Category),
        getRepositoryMock(Expense),
      ],
    }).compile();

    expenseFactory = moduleRef.get<ExpenseFactory>(ExpenseFactory);
    categoryService = moduleRef.get<CategoryService>(CategoryService);
  });

  describe('fromDto', () => {
    it('should return an expense', async () => {
      const createExpenseDto = {
        title: 'Expense 1',
        description: 'Expense 1',
        cost: 100,
        date: new Date(),
        categoriesIds: [],
      };

      const mockExpense = new Expense();
      mockExpense.title = 'Expense 1';
      mockExpense.description = 'Expense 1';
      mockExpense.cost = 100;
      mockExpense.date = new Date();

      const expense = await expenseFactory.fromDto(createExpenseDto);

      expect(expense).toStrictEqual(mockExpense);
    });

    it('should return an expense with categories', async () => {
      const createExpenseDto = {
        title: 'Expense 1',
        description: 'Expense 1',
        cost: 100,
        date: new Date(),
        categoriesIds: ['category-uuid1'],
      };

      const mockCategory = new Category();
      mockCategory.id = 'category-uuid1';
      mockCategory.name = 'Category 1';
      mockCategory.expenses = [];
      mockCategory.created_at = new Date();

      const mockExpense = new Expense();
      mockExpense.title = 'Expense 1';
      mockExpense.description = 'Expense 1';
      mockExpense.cost = 100;
      mockExpense.date = new Date();
      mockExpense.categories = [mockCategory];

      jest
        .spyOn(categoryService, 'findByIds')
        .mockResolvedValue([mockCategory]);

      const expense = await expenseFactory.fromDto(createExpenseDto);

      expect(expense).toStrictEqual(mockExpense);
    });
  });
});
