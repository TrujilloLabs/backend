
import { PartialType, ApiProperty } from '@nestjs/swagger';



export class ProductDto {
    @ApiProperty()
    id: string;

    @ApiProperty()
    name: string;

    @ApiProperty({ required: false })
    description?: string;

    @ApiProperty()
    price: number;

    @ApiProperty()
    stock: number;

    @ApiProperty()
    priceCop: number;

    @ApiProperty({ required: false })
    priceUsd?: number | null;

    @ApiProperty({ required: false })
    imageUrl?: string;

    @ApiProperty()
    storeId: string;

    @ApiProperty()
    categoryId: string;

    @ApiProperty()
    isActive: boolean;

    @ApiProperty()
    createdAt: Date;

    @ApiProperty()
    updatedAt: Date;
}