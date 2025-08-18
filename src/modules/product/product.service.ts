import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
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

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
  ) { }



  async createProduct(
    createProductDto: CreateProductDto,
    storeId: string,
  ): Promise<ProductResponseDto> {
    await this.validateCategory(createProductDto.categoryId, storeId);

    const product = this.buildProductEntity(createProductDto, storeId);
    const savedProduct = await this.productRepository.save(product);

    return this.mapToResponseDto(savedProduct);
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
        category: true, // Aseguramos que la categoría se cargue
      },
      skip,
      take: limit,
      order: { createdAt: 'DESC' }
    });

    const productDtos = products.map(product => this.mapToResponseDto(product));
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
    return this.mapToResponseDto(product);
  }

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
        // category: true
        category: {
          parentCategory: true
        }
      }
    });

    if (!product) {
      throw new NotFoundException(
        `Producto con ID ${productId} no encontrado en esta tienda`
      );
    }

    return product;
  }















  // TODO : METODOS

  update(id: number, updateProductDto: UpdateProductDto) {
    return `This action updates a #${id} product`;
  }

  remove(id: number) {
    return `This action removes a #${id} product`;
  }





  // TODO : los metos 


  private async validateCategory(categoryId: string, storeId: string): Promise<void> {
    const categoryExists = await this.categoryRepository.exist({
      where: {
        id: categoryId,
        store: storeId,
      },
    });

    if (!categoryExists) {
      throw new BadRequestException('Categoría inválida para esta tienda');
    }
  }

  private buildProductEntity(
    createProductDto: CreateProductDto,
    storeId: string,
  ): Product {
    return this.productRepository.create({
      ...createProductDto,
      storeId,
      category: { id: createProductDto.categoryId },
    });
  }

  private mapToResponseDto(product: Product): ProductResponseDto {
    return {
      id: product.id,
      name: product.name,
      description: product.description,
      price: product.price,
      stock: product.stock,
      priceCop: product.priceCop,
      priceUsd: product.priceUsd,
      imageUrl: product.imageUrl,
      storeId: product.storeId,
      // categoryId: product.category.id,
      category: this.mapCategoryToDto(product.category),
      isActive: product.isActive,
      createdAt: product.createdAt,
      updatedAt: product.updatedAt,
      deletedAt: product.deletedAt,
    };
  }
  private mapCategoryToDto(category: Category): CategoryResponseDto {
    return {
      id: category.id,
      name: category.name,
      isVisible: category.isVisible,
      storeId: category.store,
      createdAt: category.createdAt,
      updatedAt: category.updatedAt,
      parentCategory: category.parentCategory
        ? this.mapCategoryToDto(category.parentCategory) // Recursividad controlada
        : undefined
    };
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
}
