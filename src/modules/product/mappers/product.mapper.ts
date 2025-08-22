import { CategoryMapper } from "src/modules/categories/mappers/category.mapper";
import { ProductResponseDto } from "../dto/product-response.dto";
import { Product } from "../entities/product.entity";



export function mapToResponseDto(product: Product): ProductResponseDto {
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
        subcategory: CategoryMapper.toSubcategoryDto(product.subcategory),
        // category: CategoryMapper.toResponseDto(product.category),
        slug: product.slug,
        isActive: product.isActive,
        createdAt: product.createdAt,
        updatedAt: product.updatedAt,
        deletedAt: product.deletedAt,
    };
}