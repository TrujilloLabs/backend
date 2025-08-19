// parent-category.finder.ts (nuevo servicio especializado)
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Category } from '../entities/category.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ParentCategoryFinder {
    constructor(
        @InjectRepository(Category)
        private readonly categoryRepo: Repository<Category>
    ) { }

    async findOrFail(parentId: string): Promise<Category> {
        const parent = await this.categoryRepo.findOne({
            where: { id: parentId }
        });

        if (!parent) {
            throw new NotFoundException('Parent category not found');
        }

        return parent;
    }
}