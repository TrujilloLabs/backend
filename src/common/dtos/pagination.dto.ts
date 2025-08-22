import { IsOptional, IsPositive, Min } from "class-validator";


export class PaginationDto {

    // @ApiProperty({ required: false, default: 1, minimum: 1, type: Number })
    @IsOptional()
    @IsPositive()
    limit?: number;

    // @ApiProperty({ required: false, default: 0, minimum: 0, type: Number })
    @IsOptional()
    @IsPositive()
    @Min(0)
    offset?: number;
}