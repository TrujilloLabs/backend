// mappers/category.mapper.ts
import { Category } from '../entities/category.entity';
import { CategoryResponseDto } from '../dto/category-response.dto';
import { SubcategoryResponseDto } from 'src/modules/subcategories/dto/subcategory-response.dto';
import { Subcategory } from 'src/modules/subcategories/entities/subcategory.entity';

// export class CategoryMapper {
//     static toResponseDto(category: Category): CategoryResponseDto {
//         const dto = new CategoryResponseDto();
//         dto.id = category.id;
//         dto.name = category.name;
//         dto.isVisible = category.isVisible;
//         dto.storeId = category.store;
//         dto.createdAt = category.createdAt;
//         dto.updatedAt = category.updatedAt;
//         dto.deletedAt = category.deletedAt;

//         if (category.parentCategory) {
//             dto.parentCategory = this.toResponseDto(category.parentCategory);
//         }

//         return dto;
//     }

//     static toResponseDtoList(categories: Category[]): CategoryResponseDto[] {
//         return categories.map(category => this.toResponseDto(category));
//     }
// }


// import { Category } from '../entities/category.entity';
// import { Subcategory } from '../entities/subcategory.entity';
// import { CategoryResponseDto } from '../dto/category-response.dto';
// import { SubcategoryResponseDto } from '../dto/subcategory-response.dto';



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

        if (category.subcategories) {
            dto.subcategories = category.subcategories.map((sub) =>
                this.toSubcategoryDto(sub),
            );
        }

        return dto;
    }

    static toSubcategoryDto(sub: Subcategory): SubcategoryResponseDto {
        const dto = new SubcategoryResponseDto();
        dto.id = sub.id;
        dto.name = sub.name;
        dto.isVisible = sub.isVisible;
        dto.createdAt = sub.createdAt;
        dto.updatedAt = sub.updatedAt;
        dto.deletedAt = sub.deletedAt;
        return dto;
    }

    static toResponseDtoList(categories: Category[]): CategoryResponseDto[] {
        return categories.map((category) => this.toResponseDto(category));
    }
}


