
import {
    IsUUID,
    IsNotEmpty,
    IsString,
    MaxLength,
    IsOptional,
    IsBoolean,
    Min,
} from 'class-validator';
import { PartialType, ApiProperty } from '@nestjs/swagger';

export class SubcategoryResponseDto {
    @ApiProperty()
    id: string;

    @ApiProperty()
    name: string;

    @ApiProperty()
    isVisible: boolean;

    @ApiProperty()
    categoryId: string;

    @ApiProperty()
    createdAt: Date;

    @ApiProperty()
    updatedAt: Date;

    @ApiProperty()
    deletedAt: Date;
}