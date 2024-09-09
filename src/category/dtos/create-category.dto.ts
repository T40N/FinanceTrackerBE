import { ApiProperty } from '@nestjs/swagger';
import { CreateExpenseDto } from 'src/expense/dtos/create-expense.dto';

export class CreateCategoryDto {
  @ApiProperty()
  name: string;

  @ApiProperty()
  expenses: CreateExpenseDto[];
}
