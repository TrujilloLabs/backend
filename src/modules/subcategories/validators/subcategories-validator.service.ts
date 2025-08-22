import {
    Injectable,
    Logger,
    NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Category } from '../../categories/entities/category.entity';
import { Subcategory } from 'src/modules/subcategories/entities/subcategory.entity';
import { UpdateSubcategoryDto } from 'src/modules/subcategories/dto/update-subcategory.dto';
import { CategoryValidatorService } from 'src/common/validators/category.validator.service';
// import { SubcategoriesService } from 'src/modules/subcategories/subcategories.service';

@Injectable()
export class SubcategoryValidatorService {
    private readonly logger = new Logger(SubcategoryValidatorService.name);

    constructor(
        @InjectRepository(Category)
        private readonly categoryRepository: Repository<Category>,
        @InjectRepository(Subcategory)
        private readonly subcategoryRepository: Repository<Subcategory>,
        private readonly categoryValidatorService: CategoryValidatorService
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

    async validateUpdateData(
        updateDto: UpdateSubcategoryDto,
        existingSubcategory: Subcategory,
        storeId: string
    ): Promise<void> {
        await this.validateNameUniquenessIfChanged(updateDto, existingSubcategory, storeId);
        await this.validateCategoryIfProvided(updateDto, storeId);
    }

    private async validateNameUniquenessIfChanged(
        updateDto: UpdateSubcategoryDto,
        existingSubcategory: Subcategory,
        storeId: string
    ): Promise<void> {
        const isNameChanged = updateDto.name && updateDto.name !== existingSubcategory.name;

        if (isNameChanged) {
            await this.categoryValidatorService.validateUniqueNameSubCategory(
                updateDto.name,
                storeId,
                existingSubcategory.id
            );
        }
    }

    private async validateCategoryIfProvided(
        updateDto: UpdateSubcategoryDto,
        storeId: string
    ): Promise<void> {
        if (updateDto.categoryId) {
            await this.validateCategoryExistsAndBelongsToStore(updateDto.categoryId, storeId);
        }
    }

    private async validateCategoryExistsAndBelongsToStore(
        categoryId: string,
        storeId: string
    ): Promise<void> {
        // Implementar validación de que la categoría existe y pertenece a la tienda
        const categoryExists = await this.categoryRepository.exists({
            where: { id: categoryId, store: storeId }
        });

        if (!categoryExists) {
            this.logger.warn(`Category with ID ${categoryId} not found in store ${storeId}`);
            throw new NotFoundException(`Categoría con ID ${categoryId} no encontrada en esta tienda`);
        }
    }

    throwIfSubcategoryNotFound(
        subcategory: Subcategory | null,
        id: string
    ): void {
        if (!subcategory) {
            this.logger.warn(`Subcategory with ID ${id} not found`);
            throw new NotFoundException(`Subcategoría con ID ${id} no encontrada`);
        }
    }



}