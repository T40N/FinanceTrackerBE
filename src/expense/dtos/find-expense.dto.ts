import { ApiProperty } from '@nestjs/swagger';

export class FindExpenseDto {
  @ApiProperty()
  date: Date;
}
