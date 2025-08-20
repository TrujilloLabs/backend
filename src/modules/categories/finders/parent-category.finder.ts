// parent-category.finder.ts (nuevo servicio especializado)
import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Category } from '../entities/category.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ParentCategoryFinder {
    private readonly Logger: Logger = new Logger(ParentCategoryFinder.name);


    constructor(
        @InjectRepository(Category)
        private readonly categoryRepo: Repository<Category>,
    ) { }

    async findOrFail(parentId: string, storeId: string): Promise<Category> {
        const parent = await this.categoryRepo
            .createQueryBuilder('category')
            .where('category.id = :parentId', { parentId })
            .andWhere('category.store = :storeId', { storeId })
            .andWhere('category.deletedAt IS NULL') // solo categorías activas
            .getOne();

        if (!parent) {
            this.Logger.warn(`Parent category not found: ${parentId}`);
            throw new NotFoundException(
                `Parent category with ID "${parentId}" not found or has been deleted`
            );
        }

        return parent;
    }
}