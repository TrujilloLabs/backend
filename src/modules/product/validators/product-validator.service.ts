import { BadRequestException, ConflictException, Injectable, InternalServerErrorException, Logger } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Category } from "src/modules/categories/entities/category.entity";
import { Product } from "../entities/product.entity";
import { Repository } from "typeorm";

@Injectable()
export class ProductValidatorService {
    constructor(
        @InjectRepository(Category)
        private readonly categoryRepository: Repository<Category>,
        @InjectRepository(Product)
        private readonly productRepository: Repository<Product>,
    ) { }

    async validateCategory(categoryId: string, storeId: string): Promise<void> {
        const exists = await this.categoryRepository.exist({
            where: {
                id: categoryId,
                store: storeId
            }
        });

        if (!exists) {
            throw new BadRequestException('Categoría inválida para esta tienda');
        }
    }

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
                .andWhere('product.category_id = :categoryId', { categoryId }) // Corregido aquí
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




    // async validateProductName(
    //     name: string,
    //     storeId: string,
    //     categoryId: string,
    //     excludeProductId?: string
    // ): Promise<void> {


    //     const query = this.productRepository
    //         .createQueryBuilder('product')
    //         .where('LOWER(product.name) = LOWER(:name)', { name })
    //         .andWhere('product.storeId = :storeId', { storeId })
    //         .andWhere('product.categoryId = :categoryId', { categoryId });

    //     if (excludeProductId) {
    //         query.andWhere('product.id != :excludeProductId', { excludeProductId });
    //     }

    //     const exists = await query.getExists();

    //     if (exists) {
    //         throw new ConflictException('Ya existe un producto con este nombre en la misma categoría');
    //     }
    // }
}