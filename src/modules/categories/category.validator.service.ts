import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Category } from "./entities/category.entity";
import { Repository } from "typeorm";

@Injectable()
export class CategoryValidatorService {
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
}