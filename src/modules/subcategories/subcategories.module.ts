import { Module } from '@nestjs/common';
import { SubcategoriesService } from './subcategories.service';
import { SubcategoriesController } from './subcategories.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Subcategory } from './entities/subcategory.entity';
import { Category } from '../categories/entities/category.entity';
import { Store } from '../stores/entities/store.entity';
import { CategoryValidatorService } from './validators/category-validator.service';
import { StoreValidatorService } from '../auth/validators/validate-store-exists.validator';
import { CategoriesModule } from '../categories/categories.module';
import { SubcategoriesRepositoryService } from './repositories/subcategories.repository';

@Module({
  controllers: [SubcategoriesController],
  providers: [SubcategoriesService, CategoryValidatorService, StoreValidatorService, SubcategoriesRepositoryService],
  imports: [
    TypeOrmModule.forFeature([Subcategory, Category, Store]),
    CategoriesModule,


  ],
  exports: [SubcategoriesService, SubcategoriesRepositoryService],
})
export class SubcategoriesModule { }
