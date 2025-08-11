import { PartialType } from '@nestjs/mapped-types';
import { CreateLinceseDto } from './create-lincese.dto';

export class UpdateLinceseDto extends PartialType(CreateLinceseDto) {}
