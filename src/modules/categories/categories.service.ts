import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Category } from './entities/category.entity';
import { Repository } from 'typeorm';

@Injectable()
export class CategoriesService {

  constructor(
    @InjectRepository(Category)
    private readonly categoryRepo: Repository<Category>,
  ) { }


  async create(dto: CreateCategoryDto): Promise<Category> {
    const category = this.categoryRepo.create({
      name: dto.name,
      isVisible: dto.isVisible ?? true,
    });

    if (dto.parentCategoryId) {
      const parent = await this.categoryRepo.findOne({
        where: { id: dto.parentCategoryId },
      });
      if (!parent) {
        throw new NotFoundException('Parent category not found');
      }
      category.parentCategory = parent;
    }

    return this.categoryRepo.save(category);
  }

  findAll() {
    return `This action returns all categories`;
  }

  findOne(id: number) {
    return `This action returns a #${id} category`;
  }

  update(id: number, updateCategoryDto: UpdateCategoryDto) {
    return `This action updates a #${id} category`;
  }

  remove(id: number) {
    return `This action removes a #${id} category`;
  }
}
