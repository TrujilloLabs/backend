import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { Store } from './entities/store.entity';
import { User, UserRole } from '../users/entities/user.entity';
import { License } from '../lincese/entities/lincese.entity';
import { CreateStoreDto } from './dto/create-store.dto';
import { UpdateStoreDto } from './dto/update-store.dto';

@Injectable()
export class StoresService {

  constructor(private DataSource: DataSource) { }

  async createStoreWithAdmin(createStore, createUser) {

  }


  async create(createStoreDto: CreateStoreDto) {
    const storeRepo = this.DataSource.getRepository(Store);
    const store = storeRepo.create({
      name: createStoreDto.name,
      logo_url: createStoreDto.logo_url,
      description: createStoreDto.description,
      state: (createStoreDto.state as 'activa' | 'inactiva') ?? 'inactiva', // Usa 'inactiva' si no viene en el DTO
    });
    const savedStore = await storeRepo.save(store);
    return savedStore;
  }
  // ...existing code...

  findAll() {
    return `This action returns all stores`;
  }

  findOne(id: number) {
    return `This action returns a #${id} store`;
  }

  update(id: number, updateStoreDto: UpdateStoreDto) {
    return `This action updates a #${id} store`;
  }

  remove(id: number) {
    return `This action removes a #${id} store`;
  }
}
