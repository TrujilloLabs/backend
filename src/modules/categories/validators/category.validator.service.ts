import { ConflictException, Injectable, Logger, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Category } from "../entities/category.entity";
import { Repository } from "typeorm";

@Injectable()
export class CategoryValidatorService {
    private readonly logger = new Logger(CategoryValidatorService.name);


    constructor(
        @InjectRepository(Category)
        private readonly categoryRepository: Repository<Category>,


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
}