import { ConflictException, Injectable, InternalServerErrorException, Logger, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Category } from "../../modules/categories/entities/category.entity";
import { Repository } from "typeorm";
import { Subcategory } from "src/modules/subcategories/entities/subcategory.entity";

@Injectable()
export class CategoryValidatorService {
    private readonly logger = new Logger(CategoryValidatorService.name);


    constructor(
        @InjectRepository(Category)
        private readonly categoryRepository: Repository<Category>,
        @InjectRepository(Subcategory)
        private readonly subCategoryRepository: Repository<Subcategory>,
    ) { }

    async validateCategoryOwnership(
        categoryId: string,
        storeId: string
    ): Promise<void> {
        const exists = await this.categoryRepository.existsBy({
            id: categoryId,
            store: storeId
        });

        if (!exists) {
            throw new NotFoundException(
                `Category ${categoryId} not found in your store`
            );
        }
    }

    async validateUniqueName(name: string, storeId: string): Promise<void> {
        const trimmedName = name.trim().toLowerCase();

        const existingCategory = await this.categoryRepository
            .createQueryBuilder('category')
            .where('LOWER(TRIM(category.name)) = :name', { name: trimmedName })
            .andWhere('category.store = :storeId', { storeId })
            .andWhere('category.deletedAt IS NULL')
            .getOne();

        if (existingCategory) {
            this.logger.warn(`Category name conflict: ${name} already exists in store ${storeId}`);
            throw new ConflictException(`A category with the name "${name}" already exists in this store`);
        }
    }

    // async validateUniqueNameSubCategory(name: string, storeId: string): Promise<void> {
    //     const trimmedName = name.trim().toLowerCase();

    //     const existingCategory = await this.subCategoryRepository
    //         .createQueryBuilder('category')
    //         .where('LOWER(TRIM(category.name)) = :name', { name: trimmedName })
    //         .andWhere('category.store = :storeId', { storeId })
    //         .andWhere('category.deletedAt IS NULL')
    //         .getOne();

    //     if (existingCategory) {
    //         this.logger.warn(`Category name conflict: ${name} already exists in store ${storeId}`);
    //         throw new ConflictException(`A category with the name "${name}" already exists in this store`);
    //     }
    // }











    async validateUniqueNameSubCategory(
        name: string,
        storeId: string,
        excludeSubcategoryId?: string
    ): Promise<void> {
        const trimmedName = name.trim().toLowerCase();

        const queryBuilder = this.subCategoryRepository
            .createQueryBuilder('subcategory')
            .where('LOWER(TRIM(subcategory.name)) = :name', { name: trimmedName })
            .andWhere('subcategory.store = :storeId', { storeId })
            .andWhere('subcategory.deleted_at IS NULL');

        if (excludeSubcategoryId) {
            queryBuilder.andWhere('subcategory.id != :excludeSubcategoryId', {
                excludeSubcategoryId
            });
        }
        try {


            await queryBuilder.getOne();


        } catch (error) {
            this.logger.error(`Error checking subcategory uniqueness: ${error.message}`, error.stack);
            throw new InternalServerErrorException('Error checking subcategory uniqueness');
        }
        const existingSubcategory = await queryBuilder.getOne();


        if (existingSubcategory) {
            this.logger.warn(
                `Subcategory name conflict: ${name} already exists in store ${storeId}`
            );
            throw new ConflictException(
                `A subcategory with the name "${name}" already exists in this store`
            );
        }
    }
}









