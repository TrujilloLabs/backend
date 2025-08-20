// mappers/category.mapper.ts
import { Category } from '../entities/category.entity';
import { CategoryResponseDto } from '../dto/category-response.dto';

export class CategoryMapper {
    static toResponseDto(category: Category): CategoryResponseDto {
        const dto = new CategoryResponseDto();
        dto.id = category.id;
        dto.name = category.name;
        dto.isVisible = category.isVisible;
        dto.storeId = category.store;
        dto.createdAt = category.createdAt;
        dto.updatedAt = category.updatedAt;
        dto.deletedAt = category.deletedAt;

        if (category.parentCategory) {
            dto.parentCategory = this.toResponseDto(category.parentCategory);
        }

        return dto;
    }

    static toResponseDtoList(categories: Category[]): CategoryResponseDto[] {
        return categories.map(category => this.toResponseDto(category));
    }
}