import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Category } from './entities/category.entity';
import { QueryFailedError, Repository } from 'typeorm';
import { ParentCategoryFinder } from './parent-category.finder';

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


  async categoryToFindAll(storeId: string) {
    const categories = await this.categoryRepo.find({
      where: { isVisible: true, store: storeId },
      relations: ['parentCategory'],
    });
    if (!categories.length) {
      throw new NotFoundException('No categories found');
    }
    return categories;
  }



  // where: { isVisible: true },



  findOne(id: number) {
    return `This action returns a #${id} category`;
  }

  update(id: number, updateCategoryDto: UpdateCategoryDto) {
    return `This action updates a #${id} category`;
  }

  remove(id: number) {
    return `This action removes a #${id} category`;
  }








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

}
