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

@Module({
  controllers: [SubcategoriesController],
  providers: [SubcategoriesService, CategoryValidatorService, StoreValidatorService],
  imports: [
    TypeOrmModule.forFeature([Subcategory, Category]),
    CategoriesModule,


  ],
  exports: [SubcategoriesService],
})
export class SubcategoriesModule { }
