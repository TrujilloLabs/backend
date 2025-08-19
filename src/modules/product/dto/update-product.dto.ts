import { ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { CreateProductDto } from './create-product.dto';
import {
    IsOptional, IsString, IsNumber, Min, Max, IsUUID,
    MaxLength
} from 'class-validator';
import { Exclude } from 'class-transformer';

export class UpdateProductDto extends PartialType(CreateProductDto) {
    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    @MaxLength(150)
    name?: string;

    @ApiPropertyOptional()
    @IsOptional()
    @IsUUID()
    categoryId?: string;

    // Eliminar campos no actualizables
    @IsOptional()
    @Exclude() // Excluir campos que no deben actualizarse
    storeId?: never;
}