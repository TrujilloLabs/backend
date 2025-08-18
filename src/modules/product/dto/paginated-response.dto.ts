import { ApiProperty } from '@nestjs/swagger';

export class PaginatedResponseDto<T> {
    @ApiProperty({ description: 'Datos paginados' })
    data: T[];

    @ApiProperty({ description: 'Metadatos de paginación' })
    meta: {
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    };
}