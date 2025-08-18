import { Module } from '@nestjs/common';
import { Type } from 'class-transformer';
import { TypeOrmModule } from '@nestjs/typeorm';

import { CategoriesService } from './categories.service';
import { CategoriesController } from './categories.controller';
import { Category } from './entities/category.entity';
import { ParentCategoryFinder } from './finders/parent-category.finder';
import { ParentCategoryValidatorService } from './parent-category.validator';
import { CategoryValidatorService } from './category.validator.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Category]),
  ],
  controllers: [CategoriesController],
  providers: [
    CategoriesService,
    ParentCategoryFinder,
    ParentCategoryValidatorService,
    CategoryValidatorService
  ],
})
export class CategoriesModule { }
