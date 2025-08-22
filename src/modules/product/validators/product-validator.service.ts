import { BadRequestException, ConflictException, Injectable, InternalServerErrorException, Logger } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Category } from "src/modules/categories/entities/category.entity";
import { Product } from "../entities/product.entity";
import { Repository } from "typeorm";
import { UpdateProductDto } from "../dto/update-product.dto";
import { Subcategory } from "src/modules/subcategories/entities/subcategory.entity";
import { SubcategoryValidatorService } from "src/modules/subcategories/validators/subcategories-validator.service";
@Injectable()
export class ProductValidatorService {
    constructor(
        @InjectRepository(Category)
        private readonly categoryRepository: Repository<Category>,
        @InjectRepository(Product)
        private readonly productRepository: Repository<Product>,
        @InjectRepository(Subcategory)
        private readonly subcategoryRepository: Repository<Subcategory>,
        private readonly subcategoryValidator: SubcategoryValidatorService,
    ) { }

    async validateProductName(
        name: string,
        storeId: string,
        categoryId: string,
        excludeProductId?: string
    ): Promise<void> {
        const logger = new Logger('ProductValidatorService');

        try {
            if (!name || !storeId || !categoryId) {
                throw new Error('Parámetros de validación incompletos');
            }

            const queryBuilder = this.productRepository.createQueryBuilder('product')
                .select('1')
                // Usa los nombres reales de las columnas (snake_case)
                .where('product.store_id = :storeId', { storeId })
                .andWhere('product.subcategory_id = :subcategoryId', { subcategoryId: categoryId }) // Corregido aquí
                .andWhere('LOWER(TRIM(product.name)) = LOWER(TRIM(:name))', {
                    name: name.trim()
                });

            if (excludeProductId) {
                queryBuilder.andWhere('product.id != :excludeProductId', { excludeProductId });
            }

            logger.debug(`Validating product name with query: ${queryBuilder.getQuery()}`);
            logger.debug(`Parameters: ${JSON.stringify(queryBuilder.getParameters())}`);

            const exists = await queryBuilder.getRawOne();

            if (exists) {
                throw new ConflictException('Ya existe un producto con este nombre en la misma categoría');
            }
        } catch (error) {
            logger.error('Error validating product name', error.stack);

            if (error instanceof ConflictException) {
                throw error;
            }

            throw new InternalServerErrorException('Error al validar el nombre del producto');
        }
    }

    async validateUpdateData(
        updateDto: UpdateProductDto,
        storeId: string,
        productId: string
    ): Promise<void> {
        if (updateDto.categoryId) {
            await this.validateCategory(updateDto.categoryId, storeId);
        }

        //TODO : estar pendiente
        if (updateDto.name) {
            await this.validateProductName(
                updateDto.name,
                storeId,
                updateDto.subcategoryId || '',
                productId
            );
        }
    }




}