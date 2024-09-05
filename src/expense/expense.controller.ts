import { Controller, Get, Param } from '@nestjs/common';

@Controller('expense')
export class ExpenseController {
  @Get()
  findAll(): string {
    return 'This action returns all expenses';
  }

  @Get(':id')
  findOne(@Param('id') id: string): string {
    return `This action returns a #${id} expense`;
  }

  @Get('year/:year')
  findByYear(@Param('year') year: string): string {
    return `This action returns expenses for year ${year}`;
  }

  @Get('year/:year/month/:month')
  findByYearAndMonth(
    @Param('year') year: string,
    @Param('month') month: string,
  ): string {
    return `This action returns expenses for year ${year} and month ${month}`;
  }

  @Get('year/:year/month/:month/day/:day')
  findByYearMonthAndDay(
    @Param('year') year: string,
    @Param('month') month: string,
    @Param('day') day: string,
  ): string {
    return `This action returns expenses for year ${year}, month ${month} and day ${day}`;
  }
}
