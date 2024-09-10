import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { ExpenseService } from './expense.service';
import { Expense } from './expense.entity';
import { CreateExpenseDto } from './dtos/create-expense.dto';

@Controller('expense')
export class ExpenseController {
  constructor(private readonly expenseService: ExpenseService) {}

  @Get()
  findAll(): Promise<Expense[]> {
    return this.expenseService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<Expense> {
    return this.expenseService.findById(id);
  }

  @Get('year/:year')
  findByYear(@Param('year') year: string): Promise<Expense[]> {
    return this.expenseService.findByYear(year);
  }

  @Get('year/:year/month/:month')
  findByYearAndMonth(
    @Param('year') year: string,
    @Param('month') month: string,
  ): Promise<Expense[]> {
    return this.expenseService.findByYearAndMonth(year, month);
  }

  @Get('year/:year/month/:month/day/:day')
  findByYearMonthAndDay(
    @Param('year') year: string,
    @Param('month') month: string,
    @Param('day') day: string,
  ): Promise<Expense[]> {
    return this.expenseService.findByYearMonthAndDay(year, month, day);
  }

  @Post()
  create(@Body() createExpenseDto: CreateExpenseDto): Promise<Expense> {
    return this.expenseService.create(createExpenseDto);
  }

  @Put(':id')
  update(
    @Param('id') id: string,
    @Body() updateExpenseDto: Partial<CreateExpenseDto>,
  ): Promise<Expense> {
    return this.expenseService.update(id, updateExpenseDto);
  }

  @Put(':id/category/:category_id')
  addCategory(
    @Param('id') id: string,
    @Param('category_id') categoryId: string,
  ): Promise<Expense> {
    return this.expenseService.addCategory(id, categoryId);
  }

  @Delete(':id')
  delete(@Param('id') id: string): Promise<void> {
    return this.expenseService.delete(id);
  }
}
