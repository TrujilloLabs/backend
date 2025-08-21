import { Module } from '@nestjs/common';
import { SubcategoriesService } from './subcategories.service';
import { SubcategoriesController } from './subcategories.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Subcategory } from './entities/subcategory.entity';

@Module({
  controllers: [SubcategoriesController],
  providers: [SubcategoriesService],
  imports: [
    TypeOrmModule.forFeature([Subcategory]),

  ],
})
export class SubcategoriesModule { }
