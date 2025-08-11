import { IsString, IsNotEmpty, IsEnum, IsDateString } from 'class-validator';

export class CreateStoreDto {
    @IsString() @IsNotEmpty() name: string;
    @IsString() @IsNotEmpty() logo_url: string;
    @IsString() description?: string;

    // License fields (optional defaults can aplicarse server-side)
    @IsDateString() start_date: string;
    @IsDateString() end_date: string;
    @IsEnum(['mensual', 'anual']) plan: 'mensual' | 'anual';
}
