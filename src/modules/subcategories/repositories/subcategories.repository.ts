import { Injectable, InternalServerErrorException, Logger } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Subcategory } from "../entities/subcategory.entity";
import { Repository } from "typeorm";
import { SelectQueryBuilder } from "typeorm/browser";
import { SubcategoryLogger } from "../utils/subcategory-logger.helper";
import { LogMethod } from "src/common/decorators/logging.decorator";
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

    @LogMethod('warn')
    async findSubcategoryByIdAndStore(
        id: string,
        storeId: string
    ): Promise<Subcategory | null> {
        try {
            const queryBuilder = this.createBaseQueryBuilder(id, storeId);

            if (storeId) {
                this.addStoreFilter(queryBuilder, storeId);
            }
            console.log(`Executing query: ${queryBuilder.getQuery()}`);
            return await queryBuilder.getOne();
        } catch (error) {
            throw new InternalServerErrorException('Error searching for subcategory');
        }
    }

    private addStoreFilter(
        queryBuilder: SelectQueryBuilder<Subcategory>,
        storeId: string
    ): void {
        queryBuilder.andWhere('subcategory.store = :storeId', { storeId });
    }

    @LogMethod('warn')
    async softDeleteSubcategory(id: string): Promise<void> {
        try {
            await this.subCategoryRepository.softDelete(id);
        } catch (error) {
            throw new InternalServerErrorException('Error al eliminar la subcategoría');
        }
    }
}