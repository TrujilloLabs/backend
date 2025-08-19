import { IsNotEmpty, IsOptional, IsString, IsBoolean, IsUUID } from 'class-validator';
import { PartialType, ApiProperty } from '@nestjs/swagger';

export class CreateCategoryDto {
    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    name: string;

    @ApiProperty()
    @IsBoolean()
    @IsOptional()
    isVisible?: boolean;

    @ApiProperty()
    @IsUUID()
    @IsOptional()
    parentCategoryId?: string;

    // @IsUUID()
    // storeId: string;
}



