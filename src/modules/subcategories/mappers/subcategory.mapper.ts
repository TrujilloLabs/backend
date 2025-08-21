// mappers/subcategory.mapper.ts
import { Subcategory } from '../entities/subcategory.entity';
import { SubcategoryResponseDto } from '../dto/subcategory-response.dto';

export class SubcategoryMapper {
    static toResponseDto(subcategory: Subcategory): SubcategoryResponseDto {
        const dto = new SubcategoryResponseDto();
        dto.id = subcategory.id;
        dto.name = subcategory.name;
        dto.isVisible = subcategory.isVisible;
        dto.categoryId = subcategory.category.id;
        dto.storeId = subcategory.store;
        dto.createdAt = subcategory.createdAt;
        dto.updatedAt = subcategory.updatedAt;
        dto.deletedAt = subcategory.deletedAt;

        return dto;
    }

    static toResponseDtoList(subcategories: Subcategory[]): SubcategoryResponseDto[] {
        return subcategories.map(subcategory => this.toResponseDto(subcategory));
    }
}