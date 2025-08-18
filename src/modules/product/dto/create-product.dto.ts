import {
    IsUUID,
    IsNotEmpty,
    IsString,
    MaxLength,
    IsOptional,
    IsNumber,
    Min,
    IsUrl,
    IsBoolean,
    IsPositive,
    Max,
} from 'class-validator';
import { PartialType, ApiProperty } from '@nestjs/swagger';

// --- DTO para crear un nuevo producto ---
// Este DTO define las validaciones para los datos obligatorios al crear un producto.
export class CreateProductDto {
    @IsNotEmpty({ message: 'El nombre no puede estar vacío' })
    @IsString({ message: 'El nombre debe ser una cadena de texto' })
    @MaxLength(150, { message: 'El nombre no puede exceder los 150 caracteres' })
    name: string;

    @IsOptional()
    @IsString({ message: 'La descripción debe ser una cadena de texto' })
    description?: string;

    @IsNotEmpty({ message: 'El precio no puede estar vacío' })
    @IsNumber({}, { message: 'El precio debe ser un número' })
    @IsPositive({ message: 'El precio debe ser un número positivo' })
    @Max(99999999.99, { message: 'El precio excede el valor máximo permitido' })
    price: number;

    @IsNotEmpty({ message: 'El stock no puede estar vacío' })
    @IsNumber({}, { message: 'El stock debe ser un número' })
    @Min(0, { message: 'El stock no puede ser negativo' })
    stock: number;

    @IsNotEmpty({ message: 'El precio en COP no puede estar vacío' })
    @IsNumber({}, { message: 'El precio en COP debe ser un número' })
    @IsPositive({ message: 'El precio en COP debe ser un número positivo' })
    @Max(99999999.99, { message: 'El precio en COP excede el valor máximo permitido' })
    priceCop: number;

    @IsOptional()
    @IsNumber({}, { message: 'El precio en USD debe ser un número' })
    @IsPositive({ message: 'El precio en USD debe ser un número positivo' })
    @Max(99999999.99, { message: 'El precio en USD excede el valor máximo permitido' })
    priceUsd?: number | null;

    @IsOptional()
    @IsString({ message: 'La URL de la imagen debe ser una cadena de texto' })
    @IsUrl({}, { message: 'La URL de la imagen debe ser una URL válida' })
    @MaxLength(500, { message: 'La URL de la imagen no puede exceder los 500 caracteres' })
    imageUrl?: string;

    @IsNotEmpty({ message: 'El ID de la tienda no puede estar vacío' })
    @IsUUID('4', { message: 'El ID de la tienda debe ser un UUID válido' })
    storeId: string;

    @IsNotEmpty({ message: 'El ID de la categoría no puede estar vacío' })
    @IsUUID('4', { message: 'El ID de la categoría debe ser un UUID válido' })
    categoryId: string;

    @IsOptional()
    @IsBoolean({ message: 'isActive debe ser un valor booleano' })
    isActive?: boolean;
}
