import {
    IsUUID,
    IsNotEmpty,
    IsString,
    IsEmail,
    MinLength,
    MaxLength,
    IsOptional,
    IsEnum,
    IsDateString,
} from 'class-validator';
import { PartialType } from '@nestjs/swagger';
import { Role } from 'src/enums/user-role.enum';

export class CreateUserDto {
    @IsNotEmpty({ message: 'El nombre no puede estar vacío' })
    @IsString({ message: 'El nombre debe ser una cadena de texto' })
    @MaxLength(250, { message: 'El nombre no puede exceder los 250 caracteres' })
    name: string;

    @IsNotEmpty({ message: 'El email no puede estar vacío' })
    @IsEmail({}, { message: 'El email debe tener un formato válido' })
    @MaxLength(200, { message: 'El email no puede exceder los 200 caracteres' })
    email: string;

    @IsNotEmpty({ message: 'La contraseña no puede estar vacía' })
    @IsString({ message: 'La contraseña debe ser una cadena de texto' })
    @MinLength(8, { message: 'La contraseña debe tener al menos 8 caracteres' })
    password: string;

    @IsOptional()
    @IsString({ message: 'El teléfono debe ser una cadena de texto' })
    @MaxLength(15, { message: 'El teléfono no puede exceder los 15 caracteres' })
    telephone?: string;

    @IsOptional()
    @IsString({ message: 'La dirección debe ser una cadena de texto' })
    @MaxLength(100, { message: 'La dirección no puede exceder los 100 caracteres' })
    address?: string;

    @IsOptional()
    @IsEnum(Role, { message: 'El rol no es válido' })
    role?: Role;

    @IsOptional()
    @IsUUID('4', { message: 'El ID de la tienda debe ser un UUID válido' })
    store_id?: string;
}


export class UserDto {
    user_id: string;
    name: string;
    email: string;
    telephone?: string;
    address?: string;
    registration_date: Date;
    role: Role;
    store_id?: string;
}