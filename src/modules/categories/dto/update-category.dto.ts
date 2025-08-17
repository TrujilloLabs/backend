import { PartialType } from '@nestjs/swagger';
import { CreateCategoryDto } from './create-category.dto';
import { IsNotEmpty, IsOptional, IsString, IsBoolean, IsUUID } from 'class-validator';
// export class UpdateCategoryDto extends PartialType(CreateCategoryDto) {}

export class UpdateCategoryDto {
    @IsString()
    @IsOptional()
    name?: string;

    @IsBoolean()
    @IsOptional()
    isVisible?: boolean;

    @IsUUID()
    @IsOptional()
    parentCategoryId?: string;
}