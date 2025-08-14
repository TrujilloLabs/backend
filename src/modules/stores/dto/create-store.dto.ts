// import { IsString, IsNotEmpty, IsEnum, IsDateString } from 'class-validator';
import {
    IsNotEmpty,
    IsString,
    MaxLength,
    IsUrl,
    IsOptional,
    IsEnum,
    IsDateString,
    ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { PartialType } from '@nestjs/swagger';
import { LicenseDto } from 'src/modules/lincese/dto/create-lincese.dto';



export class CreateStoreDto {
    @IsNotEmpty({ message: 'El nombre de la tienda no puede estar vacío' })
    @IsString({ message: 'El nombre debe ser una cadena de texto' })
    @MaxLength(150, { message: 'El nombre no puede exceder los 150 caracteres' })
    name: string;

    @IsNotEmpty({ message: 'La URL del logo no puede estar vacía' })
    @IsString({ message: 'La URL del logo debe ser una cadena de texto' })
    @IsUrl({}, { message: 'La URL del logo debe ser una URL válida' })
    @MaxLength(500, { message: 'La URL del logo no puede exceder los 500 caracteres' })
    logo_url: string;

    @IsOptional()
    @IsString({ message: 'La descripción debe ser una cadena de texto' })
    description?: string;

    //email
    @IsNotEmpty({ message: 'El email no puede estar vacío' })
    @IsString({ message: 'El email debe ser una cadena de texto' })
    @MaxLength(150, { message: 'El email no puede exceder los 150 caracteres' })
    email: string;

    //password
    // @IsNotEmpty({ message: 'La contraseña no puede estar vacía' })
    // @IsString({ message: 'La contraseña debe ser una cadena de texto' })
    // @MaxLength(150, { message: 'La contraseña no puede exceder los 150 caracteres' })
    // password: string;

    //el store_id
    // @IsNotEmpty({ message: 'El ID de la tienda no puede estar vacío' })
    // @IsString({ message: 'El ID de la tienda debe ser una cadena de texto' })
    //que store_id se opcional
    @IsOptional()
    // @IsString({ message: 'El ID de la tienda debe ser una cadena de texto' })
    store_id?: string;

    @IsOptional()
    @IsEnum(['activa', 'inactiva'], { message: 'El estado debe ser "activa" o "inactiva"' })
    state: 'activa' | 'inactiva';

    // DTO anidado para la licencia, para que la validación se aplique
    // también a sus campos.
    @IsOptional()
    @ValidateNested()
    @Type(() => LicenseDto)
    license?: LicenseDto;
}

















// export class CreateStoreDto {
//     @IsString() @IsNotEmpty() name: string;
//     @IsString() @IsNotEmpty() logo_url: string;
//     @IsString() description?: string;
//     state: string;

//     // License fields (optional defaults can aplicarse server-side)
//     // @IsDateString() start_date: string;
//     // @IsDateString() end_date: string;
//     // @IsEnum(['mensual', 'anual']) plan: 'mensual' | 'anual';
// }

