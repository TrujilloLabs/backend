import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { LinceseService } from './lincese.service';
import { CreateLinceseDto } from './dto/create-lincese.dto';
import { UpdateLinceseDto } from './dto/update-lincese.dto';

@Controller('lincese')
export class LinceseController {
  constructor(private readonly linceseService: LinceseService) {}

  @Post()
  create(@Body() createLinceseDto: CreateLinceseDto) {
    return this.linceseService.create(createLinceseDto);
  }

  @Get()
  findAll() {
    return this.linceseService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.linceseService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateLinceseDto: UpdateLinceseDto) {
    return this.linceseService.update(+id, updateLinceseDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.linceseService.remove(+id);
  }
}
