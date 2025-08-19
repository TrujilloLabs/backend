import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Category } from "../entities/category.entity";
import { Repository } from "typeorm";
Category
@Injectable()
export class
    ParentCategoryValidatorService {
    constructor(
        @InjectRepository(Category)
        private readonly categoryRepository: Repository<Category>,
    ) { }

    async validateAndGetParent(
        parentId: string,
        storeId: string
    ): Promise<Category> {
        const parent = await this.categoryRepository.findOneBy({
            id: parentId,
            store: storeId
        });

        if (!parent) {
            throw new NotFoundException(
                `Parent category ${parentId} not found in your store`
            );
        }

        if (!parent.isVisible) {
            throw new BadRequestException(
                'Parent category must be visible'
            );
        }

        // if (parent.id === categoryId) {
        //     throw new BadRequestException(
        //         'A category cannot be its own parent'
        //     );
        // }

        return parent;
    }
}