import { ApiProperty } from '@nestjs/swagger';

export class CategoryResponseDto {
    @ApiProperty({ example: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890' })
    id: string;

    @ApiProperty({ example: 'Electrónicos' })
    name: string;

    @ApiProperty({ example: true })
    isVisible: boolean;

    @ApiProperty({
        type: CategoryResponseDto,
        required: false,
        description: 'Categoría padre (si existe)'
    })
    parentCategory?: CategoryResponseDto;

    @ApiProperty({ example: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890' })
    storeId: string;

    @ApiProperty({ example: '2023-01-01T00:00:00.000Z' })
    createdAt: Date;

    @ApiProperty({ example: '2023-01-01T00:00:00.000Z' })
    updatedAt: Date;

    @ApiProperty({ example: null, required: false })
    deletedAt?: Date;
}