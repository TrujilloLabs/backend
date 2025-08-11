import { PartialType } from '@nestjs/mapped-types';
import { CreateAuthDto } from './create-auth.dto';

export class UpdateAuthDto extends PartialType(CreateAuthDto) { }


// --- DTO para actualizar una tienda ---
// `PartialType` toma el DTO `CreateStoreDto` y hace que todos sus campos
// sean opcionales. Es la forma recomendada en NestJS para los DTOs de actualización.
// export class UpdateStoreDto extends PartialType(CreateStoreDto) {}