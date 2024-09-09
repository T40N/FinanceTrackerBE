import { ApiProperty } from '@nestjs/swagger';
import { CreateCategoryDto } from 'src/category/dtos/create-category.dto';

export class CreateExpenseDto {
  @ApiProperty()
  title: string;

  @ApiProperty()
  description: string;

  @ApiProperty()
  cost: number;

  @ApiProperty()
  date: Date;

  @ApiProperty()
  categories: CreateCategoryDto[];
}
