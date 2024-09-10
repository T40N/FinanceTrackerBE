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
import { FindExpenseDto } from './dtos/find-expense.dto';
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

  @Get('year')
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
