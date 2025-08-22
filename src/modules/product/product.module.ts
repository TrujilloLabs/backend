import { Module } from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductController } from './product.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { Category } from '../categories/entities/category.entity';
import { ProductValidatorService } from './validators/product-validator.service';
import { CategoryMapper } from '../categories/mappers/category.mapper';
import { Subcategory } from '../subcategories/entities/subcategory.entity';

@Module({
  controllers: [ProductController],
  providers: [ProductService, ProductValidatorService],
  imports: [
    TypeOrmModule.forFeature([Product, Category, Subcategory]),
  ],
  // exports: [mapperToResponseDto],
})
export class ProductModule { }
