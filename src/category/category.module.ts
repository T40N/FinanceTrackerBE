import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Category } from './category.entity';
import { CategoryController } from './category.controller';
import { CategoryService } from './category.service';
import { CategoryFactory } from './category.factory';
import { ExpenseModule } from 'src/expense/expense.module';

@Module({
  imports: [TypeOrmModule.forFeature([Category]), ExpenseModule],
  controllers: [CategoryController],
  providers: [CategoryService, CategoryFactory],
})
export class CategoryModule {}
