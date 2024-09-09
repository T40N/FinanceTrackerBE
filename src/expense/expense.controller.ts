import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ExpenseService } from './expense.service';
import { Expense } from './entities/expense.entity';
import { FindExpenseDto } from './dtos/find-expense.dto';
import { CreateExpenseDto } from './dtos/create-expense.dto';
import { ExpenseFactory } from './factories/expense.factory';

@Controller('expense')
export class ExpenseController {
  constructor(
    private readonly expenseService: ExpenseService,
    private readonly expenseFactory: ExpenseFactory,
  ) {}

  @Get()
  findAll(): Promise<Expense[]> {
    return this.expenseService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<Expense> {
    return this.expenseService.findById(id);
  }

  @Get('year/')
  findByYear(@Body() findExpenseDto: FindExpenseDto): Promise<Expense[]> {
    return this.expenseService.findByYear(findExpenseDto.date);
  }

  @Get('year/month')
  findByYearAndMonth(
    @Body() findExpenseDto: FindExpenseDto,
  ): Promise<Expense[]> {
    return this.expenseService.findByYearAndMonth(findExpenseDto.date);
  }

  @Get('year/month/day')
  findByYearMonthAndDay(
    @Body() findExpenseDto: FindExpenseDto,
  ): Promise<Expense[]> {
    return this.expenseService.findByYearMonthAndDay(findExpenseDto.date);
  }

  @Post()
  create(@Body() createExpenseDto: CreateExpenseDto): Promise<Expense> {
    const expense = this.expenseFactory.fromDto(createExpenseDto);
    return this.expenseService.save(expense);
  }
}
