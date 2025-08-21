import { PartialType } from '@nestjs/swagger';
import { CreateSubcategoryDto } from './create-subcategory.dto';
import { IsOptional, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateSubcategoryDto extends PartialType(CreateSubcategoryDto) {

    //name
    @ApiProperty({
        example: 'Electronics',
        description: 'Nombre de la subcategoría (opcional)',
    })
    @IsOptional()
    name: string;

    //invisible
    @ApiProperty({
        example: true,
        description: 'Indica si la subcategoría es visible (opcional)',
    })
    @IsOptional()
    isVisible?: boolean;

    @ApiProperty({
        example: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
        description: 'ID de la categoría (opcional)',
        required: false
    })
    @IsUUID()
    @IsOptional()
    categoryId?: string;

    //storeId
    @ApiProperty({
        example: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
        description: 'ID de la tienda (opcional)',
        required: false
    })
    @IsUUID()
    @IsOptional()
    storeId: string;
}
