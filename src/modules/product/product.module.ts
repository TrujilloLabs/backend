import { Module } from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductController } from './product.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { Category } from '../categories/entities/category.entity';
import { ProductValidatorService } from './validators/product-validator.service';
import { CategoryMapper } from '../categories/mappers/category.mapper';

@Module({
  controllers: [ProductController],
  providers: [ProductService, ProductValidatorService],
  imports: [
    TypeOrmModule.forFeature([Product, Category]),
  ],
  // exports: [mapperToResponseDto],
})
export class ProductModule { }
