// validators/category-validator.service.ts
import {
    Injectable,
    ConflictException,
    Logger
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Subcategory } from '../entities/subcategory.entity';

@Injectable()
export class CategoryValidatorService {
    private readonly logger = new Logger(CategoryValidatorService.name);

    constructor(
        @InjectRepository(Subcategory)
        private readonly subcategoryRepository: Repository<Subcategory>,
    ) { }

    async validateUniqueNameSubCategory(name: string, storeId: string): Promise<void> {
        const trimmedName = name.trim().toLowerCase();

        const existingSubcategory = await this.subcategoryRepository
            .createQueryBuilder('subcategory')
            .where('LOWER(TRIM(subcategory.name)) = :name', { name: trimmedName })
            .andWhere('subcategory.store_id = :storeId', { storeId })
            .andWhere('subcategory.deleted_at IS NULL')
            .getOne();

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