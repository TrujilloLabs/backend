import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateSubcategoryDto } from './dto/create-subcategory.dto';
import { UpdateSubcategoryDto } from './dto/update-subcategory.dto';
import { SubcategoryResponseDto } from './dto/subcategory-response.dto';
import { StoreValidatorService } from '../auth/validators/validate-store-exists.validator';
import { InjectRepository } from '@nestjs/typeorm';
import { Subcategory } from './entities/subcategory.entity';
import { Repository } from 'typeorm';
import { CategoryValidatorService } from '../categories/validators/category.validator.service';
import { CreateSubcategoryFinder } from './create-subcategory.finder';
import { CategoryMapper } from '../categories/mappers/category.mapper';
import { SubcategoryMapper } from './mappers/subcategory.mapper';
import { Category } from '../categories/entities/category.entity';

@Injectable()
export class SubcategoriesService {

  constructor(
    @InjectRepository(Subcategory)
    private readonly subCategoryRepository: Repository<Subcategory>,
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
    private readonly storeValidator: StoreValidatorService,
    private readonly categoryValidatorService: CategoryValidatorService,


  ) { }


  async create(
    createSubcategoryDto: CreateSubcategoryDto,
    storeId: string): Promise<SubcategoryResponseDto> {
    await this.storeValidator.validateStoreExists(storeId);

    const category = await this.validateCategoryExists(
      createSubcategoryDto.categoryId,
      storeId
    );

    await this.categoryValidatorService.validateUniqueNameSubCategory(
      createSubcategoryDto.name,
      storeId
    );

    const subcategory = this.buildSubcategoryEntity(
      createSubcategoryDto,
      storeId,
      category
    );

    const savedSubcategory = await this.subCategoryRepository.save(subcategory);
    return SubcategoryMapper.toResponseDto(savedSubcategory);


  }

  findAll() {
    return `This action returns all subcategories`;
  }

  findOne(id: number) {
    return `This action returns a #${id} subcategory`;
  }

  update(id: number, updateSubcategoryDto: UpdateSubcategoryDto) {
    return `This action updates a #${id} subcategory`;
  }

  remove(id: number) {
    return `This action removes a #${id} subcategory`;
  }





  ///TODO :  METODOS 


  private async validateCategoryExists(
    categoryId: string,
    storeId: string
  ): Promise<Category> {
    const category = await this.categoryRepository.findOne({
      where: {
        id: categoryId,
        store: storeId
      }
    });

    if (!category) {
      throw new NotFoundException(
        `Categoría con ID ${categoryId} no encontrada en la tienda ${storeId}`
      );
    }

    return category;
  }

  private buildSubcategoryEntity(
    dto: CreateSubcategoryDto,
    storeId: string,
    category: Category
  ): Subcategory {
    const subcategory = new Subcategory();
    subcategory.name = dto.name;
    subcategory.isVisible = dto.isVisible || false;
    subcategory.category = category;
    subcategory.store = storeId;

    return subcategory;
  }
}
