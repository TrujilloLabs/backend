import { ApiProperty } from '@nestjs/swagger';

export class CategoryResponseDto {
    @ApiProperty()
    id: string;

    @ApiProperty()
    name: string;

    @ApiProperty()
    isVisible: boolean;

    @ApiProperty({ required: false })
    parentCategory?: CategoryResponseDto;

    @ApiProperty()
    storeId: string;

    @ApiProperty()
    createdAt: Date;

    @ApiProperty()
    updatedAt: Date;
}