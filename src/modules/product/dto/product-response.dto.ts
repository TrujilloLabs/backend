
import { PartialType, ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';



export class ProductResponseDto {
    @Expose()
    @ApiProperty()
    id: string;

    @Expose()
    @ApiProperty()
    name: string;

    @Expose()
    @ApiProperty({ required: false })
    description?: string;

    @Expose()
    @ApiProperty()
    price: number;

    @Expose()
    @ApiProperty()
    stock: number;

    @Expose()
    @ApiProperty()
    priceCop: number;

    @Expose()
    @ApiProperty({ required: false })
    priceUsd?: number | null;

    @Expose()
    @ApiProperty({ required: false })
    imageUrl?: string;

    @Expose()
    @ApiProperty()
    storeId: string;

    @Expose()
    @ApiProperty()
    categoryId: string;

    @Expose()
    @ApiProperty()
    isActive: boolean;

    @Expose()
    @ApiProperty()
    createdAt: Date;

    @Expose()
    @ApiProperty()
    updatedAt: Date;
}