import { Module } from '@nestjs/common';
import { Type } from 'class-transformer';
import { TypeOrmModule } from '@nestjs/typeorm';

import { CategoriesService } from './categories.service';
import { CategoriesController } from './categories.controller';
import { Category } from './entities/category.entity';
import { ParentCategoryFinder } from './finders/parent-category.finder';
import { ParentCategoryValidatorService } from './validators/parent-category.validator';
import { CategoryValidatorService } from './validators/category.validator.service';
import { AuthService } from '../auth/auth.service';
import { UsersModule } from '../users/users.module';
import { AuthModule } from '../auth/auth.module';
import { StoreValidatorService } from '../auth/validators/validate-store-exists.validator';

@Module({
  imports: [
    TypeOrmModule.forFeature([Category]),
    UsersModule,
    AuthModule
  ],
  controllers: [CategoriesController],
  providers: [
    CategoriesService,
    ParentCategoryFinder,
    ParentCategoryValidatorService,
    CategoryValidatorService,
    StoreValidatorService,
  ],
})
export class CategoriesModule { }
