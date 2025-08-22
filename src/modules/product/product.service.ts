import { BadRequestException, ConflictException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Category } from '../categories/entities/category.entity';
import { Product } from './entities/product.entity';
import { FindManyOptions, LessThanOrEqual, Like, MoreThanOrEqual, Repository } from 'typeorm';
import { ProductResponseDto } from './dto/product-response.dto';
import { IProduct } from 'src/interfaces/product.interface';
import { PaginationDto } from './dto/pagination.dto';
import { ProductFilterDto } from './dto/product-filter.dto';
import { PaginatedResponseDto } from './dto/paginated-response.dto';
import { CategoryResponseDto } from '../categories/dto/category-response.dto';
import { ProductValidatorService } from './validators/product-validator.service';
import { DeleteResult } from 'typeorm/browser';
import { CategoryMapper } from '../categories/mappers/category.mapper';
import { mapToResponseDto } from './mappers/product.mapper';
import { Subcategory } from '../subcategories/entities/subcategory.entity';
import { LogMethod } from 'src/common/decorators/logging.decorator';
@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
    @InjectRepository(Subcategory)
    private readonly subcategoryRepository: Repository<Subcategory>,
    private readonly productValidator: ProductValidatorService,

    // private readonly validator: ProductValidatorService,
  ) { }


  async createProduct(
    createProductDto: CreateProductDto,
    storeId: string,
  ): Promise<ProductResponseDto> {
    await this.productValidator.validateCategory(createProductDto.subcategoryId, storeId);

    const product = this.buildProductEntity(createProductDto, storeId);
    const savedProduct = await this.productRepository.save(product);

    return mapToResponseDto(savedProduct);
  }

  async findAllByStoreId(
    storeId: string,
    paginationDto: PaginationDto,
    filterDto?: ProductFilterDto
  ): Promise<PaginatedResponseDto<ProductResponseDto>> {

    const page = paginationDto.page || 1;
    const limit = paginationDto.limit || 10;

    const skip = (page - 1) * limit;

    const where = this.buildWhereClause(storeId, filterDto);

    const [products, total] = await this.productRepository.findAndCount({
      where,
      relations: {
        subcategory: true, // Aseguramos que la categoría se cargue
      },
      skip,
      take: limit,
      order: { createdAt: 'DESC' }
    });

    const productDtos = products.map(product => mapToResponseDto(product));
    return this.buildPaginatedResponse(
      productDtos,
      total,
      page,
      limit
    );
  }

  async getProductById(
    productId: string,
    storeId: string
  ): Promise<ProductResponseDto> {
    const product = await this.findProductOrFail(productId, storeId);
    return mapToResponseDto(product);
  }

  async updateProduct(
    productId: string,
    updateDto: UpdateProductDto,
    storeId: string
  ): Promise<ProductResponseDto> {
    const product = await this.findProductOrFail(productId, storeId);

    await this.productValidator.validateUpdateData(updateDto, storeId, productId);

    this.applyUpdates(product, updateDto);

    const updatedProduct = await this.saveProduct(product);

    return mapToResponseDto(updatedProduct);
  }

  async remove(
    productId: string,
    storeId: string
  ): Promise<DeleteResult> {

    const product = await this.findProductOrFail(productId, storeId);

    return this.safeDeleteProduct(product.id, storeId);
  }



  // TODO : METODOS 

  private buildProductEntity(
    createProductDto: CreateProductDto,
    storeId: string,
  ): Product {
    return this.productRepository.create({
      ...createProductDto,
      storeId,
      subcategory: { id: createProductDto.subcategoryId } as Subcategory, // Asignar subcategoría por ID
    });
  }


  private buildWhereClause(
    storeId: string,
    filterDto?: ProductFilterDto
  ): FindManyOptions<Product>['where'] {
    const where: any = { storeId };

    if (filterDto) {
      if (filterDto.name) {
        where.name = Like(`%${filterDto.name}%`);
      }

      if (filterDto.categoryId) {
        where.categoryId = filterDto.categoryId;
      }

      if (filterDto.minPrice !== undefined) {
        where.price = MoreThanOrEqual(filterDto.minPrice);
      }

      if (filterDto.maxPrice !== undefined) {
        where.price = LessThanOrEqual(filterDto.maxPrice);
      }

      if (filterDto.isActive !== undefined) {
        where.isActive = filterDto.isActive;
      }
    }

    return where;
  }

  private buildPaginatedResponse(
    data: ProductResponseDto[],
    total: number,
    page: number,
    limit: number
  ): PaginatedResponseDto<ProductResponseDto> {
    return {
      data,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      }
    };
  }

  @LogMethod('warn')
  private async findProductOrFail(
    productId: string,
    storeId: string
  ): Promise<Product> {
    const product = await this.productRepository.findOne({
      where: {
        id: productId,
        storeId
      },
      relations: {
        subcategory: true
        // category: {
        //   parentCategory: true
        // }
      }
    });

    if (!product) {
      throw new NotFoundException(
        `Producto con ID ${productId} no encontrado en esta tienda`
      );
    }

    return product;
  }


  private applyUpdates(product: Product, updateDto: UpdateProductDto): void {
    // Actualizar solo los campos proporcionados
    Object.keys(updateDto).forEach(key => {
      if (key === 'subcategoryId' && updateDto.subcategoryId) {
        product.subcategory = { id: updateDto.subcategoryId } as Subcategory; // Asignar subcategoría por ID
      } else if (updateDto[key] !== undefined && key !== 'subcategoryId') {
        product[key] = updateDto[key];
      }
    });
  }

  private async saveProduct(product: Product): Promise<Product> {
    try {
      return await this.productRepository.save(product);
    } catch (error) {
      this.handleSaveError(error);
    }
  }

  private handleSaveError(error: any): never {
    if (error.code === '23505') { // Unique constraint violation

      throw new ConflictException(error.detail || 'Error al guardar el producto: nombre duplicado');
      // throw new ConflictException('El nombre del producto ya existe en esta categoría');
    }
    throw new InternalServerErrorException('Error al actualizar el producto');
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

  private async safeDeleteProduct(productId: string, storeId: string): Promise<DeleteResult> {

    try {
      return await this.productRepository.softDelete(productId)

    } catch (error) {

      this.handleDeleteError(error, productId);

    }

  }

}
