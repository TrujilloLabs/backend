import { IsBoolean, IsNotEmpty, IsOptional, IsString, IsUUID, MaxLength } from "class-validator";

export class CreateSubcategoryDto {
    @IsNotEmpty({ message: 'El nombre no puede estar vacío' })
    @IsString({ message: 'El nombre debe ser una cadena de texto' })
    @MaxLength(150, { message: 'El nombre no puede exceder los 150 caracteres' })
    name: string;

    @IsOptional()
    @IsBoolean({ message: 'isVisible debe ser un valor booleano' })
    isVisible?: boolean;

    @IsNotEmpty({ message: 'El ID de la categoría no puede estar vacío' })
    @IsUUID('4', { message: 'El ID de la categoría debe ser un UUID válido' })
    categoryId: string;
}
