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



export class CreateLinceseDto { }


export class LicenseDto {
    @IsNotEmpty({ message: 'La fecha de inicio no puede estar vacía' })
    @IsDateString({}, { message: 'La fecha de inicio debe ser una cadena de fecha ISO 8601' })
    start_date: string;

    @IsNotEmpty({ message: 'La fecha de finalización no puede estar vacía' })
    @IsDateString({}, { message: 'La fecha de finalización debe ser una cadena de fecha ISO 8601' })
    end_date: string;

    @IsNotEmpty({ message: 'El plan no puede estar vacío' })
    @IsEnum(['mensual', 'anual'], { message: 'El plan debe ser "mensual" o "anual"' })
    plan: 'mensual' | 'anual';
}