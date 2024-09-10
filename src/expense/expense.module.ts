import { Module } from '@nestjs/common';
import { ExpenseController } from './expense.controller';
import { ExpenseService } from './expense.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Expense } from './expense.entity';
import { ExpenseFactory } from './expense.factory';
import { CategoryModule } from 'src/category/category.module';

@Module({
  imports: [TypeOrmModule.forFeature([Expense]), CategoryModule],
  controllers: [ExpenseController],
  providers: [ExpenseService, ExpenseFactory],
})
export class ExpenseModule {}
