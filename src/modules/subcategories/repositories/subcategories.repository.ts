import { Injectable, InternalServerErrorException, Logger } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Subcategory } from "../entities/subcategory.entity";
import { Repository } from "typeorm";
import { SelectQueryBuilder } from "typeorm/browser";

@Injectable()
export class SubcategoriesRepositoryService {
    private readonly logger = new Logger(SubcategoriesRepositoryService.name);

    constructor(
        @InjectRepository(Subcategory)
        private readonly subCategoryRepository: Repository<Subcategory>,
    ) { }


    createBaseQueryBuilder(id: string, storeId: string): SelectQueryBuilder<Subcategory> {
        return this.subCategoryRepository
            .createQueryBuilder('subcategory')
            .leftJoinAndSelect('subcategory.category', 'category') // Solo necesitas la categoría
            .where('subcategory.id = :id', { id })
            .andWhere('subcategory.store = :storeId', { storeId }) // Validar que pertenezca al store
            .andWhere('subcategory.deletedAt IS NULL');
    }


    async findSubcategoryByIdAndStore(
        id: string,
        storeId: string
    ): Promise<Subcategory | null> {
        try {
            const queryBuilder = this.createBaseQueryBuilder(id, storeId);
            // const queryBuilder = this.createBaseQueryBuilder(id, storeId);

            if (storeId) {
                this.addStoreFilter(queryBuilder, storeId);
            }
            console.log(`Executing query: ${queryBuilder.getQuery()}`);
            return await queryBuilder.getOne();
        } catch (error) {
            this.logger.error(`Error finding subcategory ${id}: ${error.message}`, error.stack);
            throw new InternalServerErrorException('Error searching for subcategory');
        }
    }

    private addStoreFilter(
        queryBuilder: SelectQueryBuilder<Subcategory>,
        storeId: string
    ): void {
        queryBuilder.andWhere('subcategory.store = :storeId', { storeId });
    }
}