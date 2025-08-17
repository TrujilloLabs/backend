import { Module } from '@nestjs/common';
import { Type } from 'class-transformer';
import { TypeOrmModule } from '@nestjs/typeorm';

import { CategoriesService } from './categories.service';
import { CategoriesController } from './categories.controller';
import { Category } from './entities/category.entity';
import { ParentCategoryFinder } from './parent-category.finder';

@Module({
  imports: [
    TypeOrmModule.forFeature([Category]),
  ],
  controllers: [CategoriesController],
  providers: [
    CategoriesService,
    ParentCategoryFinder
  ],
})
export class CategoriesModule { }
