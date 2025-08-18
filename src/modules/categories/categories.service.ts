import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Category } from './entities/category.entity';
import { QueryFailedError, Repository } from 'typeorm';
import { ParentCategoryFinder } from './parent-category.finder';
import { ICategory } from 'src/interfaces/category.interface';

@Injectable()
export class CategoriesService {

  constructor(
    @InjectRepository(Category)
    private readonly categoryRepo: Repository<Category>,
    private readonly parentFinder: ParentCategoryFinder
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

















  update(id: number, updateCategoryDto: UpdateCategoryDto) {
    return `This action updates a #${id} category`;
  }

  remove(id: number) {
    return `This action removes a #${id} category`;
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

}
