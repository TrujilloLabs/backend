import { PartialType } from '@nestjs/swagger';
import { CreateCategoryDto } from './create-category.dto';
import { IsNotEmpty, IsOptional, IsString, IsBoolean, IsUUID, Validate } from 'class-validator';
import { ParentCategoryValidatorService } from '../validators/parent-category.validator';
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
    @Validate(ParentCategoryValidatorService) // Validación personalizada
    parentCategoryId?: string;
}