import { Injectable } from '@nestjs/common';
import { CreateLinceseDto } from './dto/create-lincese.dto';
import { UpdateLinceseDto } from './dto/update-lincese.dto';

@Injectable()
export class LinceseService {
  create(createLinceseDto: CreateLinceseDto) {
    return 'This action adds a new lincese';
  }

  findAll() {
    return `This action returns all lincese`;
  }

  findOne(id: number) {
    return `This action returns a #${id} lincese`;
  }

  update(id: number, updateLinceseDto: UpdateLinceseDto) {
    return `This action updates a #${id} lincese`;
  }

  remove(id: number) {
    return `This action removes a #${id} lincese`;
  }
}
