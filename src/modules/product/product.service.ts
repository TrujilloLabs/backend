import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Category } from '../categories/entities/category.entity';
import { Product } from './entities/product.entity';
import { Repository } from 'typeorm';
import { ProductResponseDto } from './dto/product-response.dto';
import { IProduct } from 'src/interfaces/product.interface';

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












  findOne(id: number) {
    return `This action returns a #${id} product`;
  }

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

  private mapToResponseDto(product: IProduct): ProductResponseDto {
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
      categoryId: product.category.id,
      isActive: product.isActive,
      createdAt: product.createdAt,
      updatedAt: product.updatedAt,
    };
  }
}
