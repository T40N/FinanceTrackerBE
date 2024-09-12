import { Module } from '@nestjs/common';
import { ExpenseService } from './services/expense.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Expense } from './entities/expense.entity';
import { CategoryModule } from 'src/category/category.module';
import { ExpenseController } from './controllers/expense.controller';
import { ExpenseFactory } from './factories/expense.factory';

@Module({
  imports: [TypeOrmModule.forFeature([Expense]), CategoryModule],
  controllers: [ExpenseController],
  providers: [ExpenseService, ExpenseFactory],
})
export class ExpenseModule {}
