import { Injectable, InternalServerErrorException, NotFoundException, Logger, ConflictException } from '@nestjs/common';
import { CreateSubcategoryDto } from './dto/create-subcategory.dto';
import { UpdateSubcategoryDto } from './dto/update-subcategory.dto';
import { SubcategoryResponseDto } from './dto/subcategory-response.dto';
import { StoreValidatorService } from '../auth/validators/validate-store-exists.validator';
import { InjectRepository } from '@nestjs/typeorm';
import { Subcategory } from './entities/subcategory.entity';
import { Repository } from 'typeorm';
import { CategoryValidatorService } from '../../common/validators/category.validator.service';
import { CreateSubcategoryFinder } from './create-subcategory.finder';
import { CategoryMapper } from '../categories/mappers/category.mapper';
import { SubcategoryMapper } from './mappers/subcategory.mapper';
import { Category } from '../categories/entities/category.entity';
import { SelectQueryBuilder } from 'typeorm/browser';
import { SubcategoryValidatorService } from '../categories/validators/subcategories-validator.service';
import { SubcategoriesRepositoryService } from './repositories/subcategories.repository';
@Injectable()
export class SubcategoriesService {
  private readonly logger = new Logger(SubcategoriesService.name);

  constructor(
    @InjectRepository(Subcategory)
    private readonly subCategoryRepository: Repository<Subcategory>,
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
    private readonly storeValidator: StoreValidatorService,
    private readonly categoryValidatorService: CategoryValidatorService,
    private readonly subcategoryValidatorService: SubcategoryValidatorService,
    private readonly subcategoriesRepositoryService: SubcategoriesRepositoryService,


  ) { }


  async create(
    createSubcategoryDto: CreateSubcategoryDto,
    storeId: string): Promise<SubcategoryResponseDto> {
    await this.storeValidator.validateStoreExists(storeId);

    const category = await this.subcategoryValidatorService.validateCategoryExists(
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

  async findAll(userStoreId): Promise<SubcategoryResponseDto[]> {
    try {
      this.logger.log('Fetching all subcategories');

      const subcategories = await this.subCategoryRepository.find({
        relations: ['category'],
        // where: { deletedAt: null },
        where: userStoreId ? { store: userStoreId } : {},
        order: { createdAt: 'DESC' },
      });

      this.logger.log(`Found ${subcategories.length} subcategories`);

      return SubcategoryMapper.toResponseDtoList(subcategories);
    } catch (error) {
      this.logger.error('Error fetching subcategories', error.stack);
      throw new InternalServerErrorException('Error al obtener las subcategorías');
    }
  }

  // Si necesitas filtrar por tienda
  async findAllByStore(storeId: string): Promise<SubcategoryResponseDto[]> {
    try {
      this.logger.log(`Fetching subcategories for store: ${storeId}`);

      const subcategories = await this.subCategoryRepository.find({
        relations: ['category'],
        where: {
          store: storeId,
          // deletedAt: null
        },
        order: { createdAt: 'DESC' },
      });

      this.logger.log(`Found ${subcategories.length} subcategories for store ${storeId}`);

      return SubcategoryMapper.toResponseDtoList(subcategories);
    } catch (error) {
      this.logger.error('Error fetching subcategories by store', error.stack);
      throw new InternalServerErrorException('Error al obtener las subcategorías de la tienda');
    }
  }


  async findOne(id: string, storeId: string): Promise<SubcategoryResponseDto> {
    this.logFindOneAttempt(id);

    const subcategory = await this.subcategoriesRepositoryService.findSubcategoryByIdAndStore(id, storeId);

    this.subcategoryValidatorService.throwIfSubcategoryNotFound(subcategory, id);

    return SubcategoryMapper.toResponseDto(subcategory!);
  }



  async update(
    id: string,
    updateSubcategoryDto: UpdateSubcategoryDto,
    storeId: string
  ): Promise<SubcategoryResponseDto> {
    this.logUpdateAttempt(id);

    //TODO:  AQUI VMAOS
    const existingSubcategory = await this.findExistingSubcategoryOrThrow(id, storeId);

    // await this.validateUpdateData(updateSubcategoryDto, existingSubcategory, storeId);

    await this.subcategoryValidatorService.validateUpdateData(updateSubcategoryDto, existingSubcategory, storeId);

    const updatedSubcategory = await this.updateSubcategoryEntity(
      existingSubcategory,
      updateSubcategoryDto
    );

    return SubcategoryMapper.toResponseDto(updatedSubcategory);
  }


  async remove(id: string, storeId: string): Promise<void> {
    this.logRemoveAttempt(id);

    await this.findExistingSubcategoryOrThrow(id, storeId);

    await this.softDeleteSubcategory(id);

    this.logRemoveSuccess(id);
  }



  //TODO : METODOS


  private logRemoveAttempt(id: string): void {
    this.logger.log(`Attempting to delete subcategory with ID: ${id}`);
  }

  private logSubcategoryNotFound(id: string, storeId: string): void {
    this.logger.warn(`Subcategory with ID ${id} not found in store ${storeId}`);
  }

  private async softDeleteSubcategory(id: string): Promise<void> {
    try {
      await this.subCategoryRepository.softDelete(id);
    } catch (error) {
      this.logSoftDeleteError(id, error);
      throw new InternalServerErrorException('Error al eliminar la subcategoría');
    }
  }

  private logSoftDeleteError(id: string, error: any): void {
    this.logger.error(`Error performing soft delete for subcategory ${id}: ${error.message}`, error.stack);
  }

  private logRemoveSuccess(id: string): void {
    this.logger.log(`Subcategory with ID: ${id} successfully soft deleted`);
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

  private async findExistingSubcategoryOrThrow(
    id: string,
    storeId: string
  ): Promise<Subcategory> {
    const subcategory = await this.subCategoryRepository.findOne({
      where: { id, store: storeId },
      relations: ['category'],
    });

    if (!subcategory) {
      this.logger.warn(`Subcategory with ID ${id} not found in store ${storeId}`);
      throw new NotFoundException(`Subcategoría con ID ${id} no encontrada en esta tienda`);
    }

    return subcategory;
  }

  private async updateSubcategoryEntity(
    existingSubcategory: Subcategory,
    updateDto: UpdateSubcategoryDto
  ): Promise<Subcategory> {
    try {
      const updatedSubcategory = this.subCategoryRepository.merge(
        existingSubcategory,
        updateDto
      );

      return await this.subCategoryRepository.save(updatedSubcategory);
    } catch (error) {
      this.logger.error(`Error saving subcategory: ${error.message}`, error.stack);
      throw new InternalServerErrorException('Error al guardar la subcategoría');
    }
  }


  private logFindOneAttempt(id: string): void {
    this.logger.log(`Fetching subcategory with ID: ${id}`);
  }

  private logFindUpdateAttempt(id: string): void {
    this.logger.log(`Updating subcategory with ID: ${id}`);
  }

  private logUpdateAttempt(id: string): void {
    this.logger.log(`Updating subcategory with ID: ${id}`);
  }
}
