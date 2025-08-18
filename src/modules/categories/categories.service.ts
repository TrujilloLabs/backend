import { ConflictException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Category } from './entities/category.entity';
import { QueryFailedError, Repository } from 'typeorm';
import { ParentCategoryFinder } from './parent-category.finder';
import { ICategory } from 'src/interfaces/category.interface';
import { ParentCategoryValidatorService } from './parent-category.validator';
import { CategoryValidatorService } from './category.validator.service';
import { DeleteResult } from 'typeorm/browser';

@Injectable()
export class CategoriesService {

  constructor(
    @InjectRepository(Category)
    private readonly categoryRepo: Repository<Category>,
    private readonly parentFinder: ParentCategoryFinder,
    private readonly parentValidator: ParentCategoryValidatorService,
    private readonly categoryValidator: CategoryValidatorService
  ) { }


  async categoryToCreate(dto: CreateCategoryDto, storeId: string): Promise<Category> {
    await this.validateCategoryName(dto.name, storeId);
    const category = this.buildCategoryEntity(dto, storeId);
    if (dto.parentCategoryId) {
      category.parentCategory = await this.parentFinder.findOrFail(dto.parentCategoryId);
    }
    return this.categoryRepo.save(category);
  }


  async categoryToFindAll(storeId: string): Promise<Category[]> {
    const categories = await this.findCategories(storeId);
    this.validateCategoriesExist(categories);
    return categories;
  }


  async findCategoryByIdAndStore(
    categoryId: string,
    storeId: string
  ): Promise<ICategory> {
    const category = await this.categoryRepo
      .createQueryBuilder('category')
      .leftJoinAndSelect('category.parentCategory', 'parentCategory')
      .leftJoinAndSelect('category.subcategories', 'subcategories')
      .where('category.id = :categoryId', { categoryId })
      .andWhere('category.store = :storeId', { storeId })
      .getOne();

    this.throwIfNotFound(category, categoryId, storeId);

    return this.toICategory(category!);
  }


  async updateCategory(
    categoryId: string,
    storeId: string,
    updateData: UpdateCategoryDto
  ): Promise<ICategory> {
    const category = await this.validateCategoryExists(categoryId, storeId);

    this.applyCategoryUpdates(category, updateData);

    if (updateData.parentCategoryId) {
      category.parentCategory = await this.parentValidator.validateAndGetParent(
        updateData.parentCategoryId,
        storeId
      );
    }

    const updatedCategory = await this.categoryRepo.save(category);
    return this.toICategory(updatedCategory);
  }

  async deleteCategory(
    categoryId: string,
    storeId: string
  ): Promise<DeleteResult> {
    await this.categoryValidator.validateCategoryOwnership(categoryId, storeId);

    return this.safeDeleteCategory(categoryId);
  }



  // TODO: METODOS EXTRAS


  private buildCategoryEntity(dto: CreateCategoryDto, storeId: string): Category {
    return this.categoryRepo.create({
      name: dto.name,
      store: storeId,
      isVisible: dto.isVisible ?? true,
    });
  }


  private async validateCategoryName(name: string, storeId: string): Promise<void> {
    try {
      const exists = await this.categoryRepo.exists({
        where: {
          name,
          store: storeId
        }
      });

      if (exists) {
        throw new ConflictException('Category name already exists in this store');
      }
    } catch (error) {
      if (error instanceof QueryFailedError && error.driverError?.code === '23505') {
        throw new ConflictException('Category name already exists in this store');
      }
      throw error;
    }
  }


  private async findCategories(storeId: string): Promise<Category[]> {
    return this.categoryRepo.find({
      where: {
        isVisible: true,
        store: storeId
      },
      relations: ['parentCategory'],
    });
  }

  private validateCategoriesExist(categories: Category[]): void {
    if (categories.length === 0) {
      throw new NotFoundException('No visible categories found for this store');
    }
  }

  private toICategory(category: Category): ICategory {
    return {
      id: category.id,
      name: category.name,
      isVisible: category.isVisible,
      parentCategory: category.parentCategory ? this.toICategory(category.parentCategory) : undefined,
      subcategories: category.subcategories?.map(sub => this.toICategory(sub)) || [],
      store: category.store,
      createdAt: category.createdAt,
      updatedAt: category.updatedAt
    };
  }


  private throwIfNotFound(
    category: Category | null,
    categoryId: string,
    storeId: string
  ): void {
    if (!category) {
      throw new NotFoundException(
        `Category ${categoryId} not found in store ${storeId}`
      );
    }
  }

  private async validateCategoryExists(
    categoryId: string,
    storeId: string
  ): Promise<Category> {
    const category = await this.categoryRepo.findOneBy({
      id: categoryId,
      store: storeId
    });

    if (!category) {
      throw new NotFoundException(
        `Category with ID ${categoryId} not found in your store`
      );
    }
    return category;
  }

  private applyCategoryUpdates(
    category: Category,
    updateData: UpdateCategoryDto
  ): void {
    if (updateData.name) {
      category.name = updateData.name.trim();
    }

    if (updateData.isVisible !== undefined) {
      category.isVisible = updateData.isVisible;
    }

  }


  private async safeDeleteCategory(categoryId: string): Promise<DeleteResult> {
    try {
      return await this.categoryRepo.delete(categoryId);
    } catch (error) {
      this.handleDeleteError(error, categoryId);
    }
  }

  private handleDeleteError(error: any, categoryId: string): never {
    if (error.code === '23503') { // Foreign key violation
      throw new ConflictException(
        `Cannot delete category ${categoryId} because it has associated products or subcategories`
      );
    }
    throw new InternalServerErrorException(
      `Failed to delete category ${categoryId}`
    );
  }

}
