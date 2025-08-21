import {
    Injectable,
    NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Category } from '../entities/category.entity';

@Injectable()
export class SubcategoryValidatorService {
    constructor(
        @InjectRepository(Category)
        private readonly categoryRepository: Repository<Category>,
    ) { }

    async validateCategoryExists(
        categoryId: string,
        storeId: string
    ): Promise<Category> {
        const category = await this.categoryRepository.findOne({
            where: {
                id: categoryId,
                store: storeId
            }
        });

        if (!category) {
            throw new NotFoundException(
                `Categoría con ID ${categoryId} no encontrada en la tienda ${storeId}`
            );
        }

        return category;
    }







}