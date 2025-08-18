import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Category } from '../categories/entities/category.entity';
import { Product } from './entities/product.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepo: Repository<Product>,
    @InjectRepository(Category)
    private readonly categoryRepo: Repository<Category>,
  ) { }



  async productToCreate(dto: CreateProductDto, storeId: string): Promise<Product> {
    // Validar que la categoría pertenezca a la tienda
    const category = await this.categoryRepo.findOne({
      where: {
        id: dto.categoryId,
        store: storeId
      },
    });
    if (!category) {
      throw new BadRequestException('Categoría inválida para esta tienda');
    }

    const product = this.productRepo.create({ ...dto, storeId });
    return await this.productRepo.save(product);
  }

  findAll() {
    return `This action returns all product`;
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
}
