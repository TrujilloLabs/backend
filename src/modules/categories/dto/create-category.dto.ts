import { IsNotEmpty, IsOptional, IsString, IsBoolean, IsUUID } from 'class-validator';
import { PartialType, ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';

export class CreateCategoryDto {
    @ApiProperty({
        example: 'Electronics',
        description: 'The name of the category'
    })
    @IsString()
    @IsNotEmpty()
    @Transform(({ value }) => value.trim()) //esta linea es para eliminar espacios en blanco
    name: string;

    @ApiProperty({
        example: true,
        description: 'Indica si la categoría es visible',
        required: false,
        default: true
    })
    @IsBoolean()
    @IsOptional()
    isVisible?: boolean;

    @ApiProperty({
        example: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
        description: 'ID de la categoría padre (opcional)',
        required: false
    })
    @IsUUID()
    @IsOptional()
    parentCategoryId?: string;

    // @IsUUID()
    // storeId: string;
}



