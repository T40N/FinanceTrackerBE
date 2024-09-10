import { ApiProperty } from '@nestjs/swagger';

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
  categoriesIds: string[];
}
