// dto/create-subcategory.dto.ts
import {
    IsNotEmpty, IsOptional, IsString, IsBoolean, IsUUID, MaxLength,
    IsUrl
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';

export class CreateSubcategoryDto {
    @ApiProperty({
        example: 'Hamburguesas',
        description: 'Nombre de la subcategoría'
    })
    @IsString()
    @IsNotEmpty()
    @MaxLength(150)
    @Transform(({ value }) => value?.trim())
    name: string;

    @ApiProperty({
        example: true,
        description: 'Indica si la subcategoría es visible',
        required: false,
        default: true
    })
    @IsBoolean()
    @IsOptional()
    @Transform(({ value }) => value === 'true' || value === true)
    isVisible?: boolean = true;

    @ApiProperty({ required: false, example: 'https://example.com/image.jpg' })
    @IsString({ message: 'La URL de la imagen debe ser una cadena de texto' })
    @IsUrl({}, { message: 'La URL de la imagen debe ser una URL válida' })
    @MaxLength(500, { message: 'La URL de la imagen no puede exceder los 500 caracteres' })
    imageUrl: string;


    @ApiProperty({
        example: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
        description: 'ID de la categoría padre'
    })
    @IsUUID()
    @IsNotEmpty()
    categoryId: string;
}
