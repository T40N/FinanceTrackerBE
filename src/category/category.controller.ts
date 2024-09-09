import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { CategoryService } from './category.service';
import { CategoryFactory } from './category.factory';
import { CreateCategoryDto } from './dtos/create-category.dto';
import { Category } from './category.entity';

@Controller('category')
export class CategoryController {
  constructor(
    private readonly categoryService: CategoryService,
    private readonly categoryFactory: CategoryFactory,
  ) {}

  @Get()
  findAll(): Promise<Category[]> {
    return this.categoryService.findAll();
  }

  @Get(':id')
  findOne(@Param() id: string): Promise<Category> {
    return this.categoryService.findById(id);
  }

  @Get('name/:name')
  findByName(@Param() name: string): Promise<Category[]> {
    return this.categoryService.findByName(name);
  }

  @Post()
  create(@Body() createCategoryDto: CreateCategoryDto): Promise<Category> {
    const category = this.categoryFactory.fromDto(createCategoryDto);
    return this.categoryService.save(category);
  }

  @Put(':id')
  update(
    @Param() id: string,
    @Body() createCategoryDto: CreateCategoryDto,
  ): Promise<Category> {
    const category = this.categoryFactory.fromDto(createCategoryDto);
    category.id = id;
    return this.categoryService.save(category);
  }

  @Delete(':id')
  delete(@Param() id: string): Promise<void> {
    return this.categoryService.delete(id);
  }
}
