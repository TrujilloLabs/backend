import { Injectable, NotFoundException } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { Store } from './entities/store.entity';
import { User } from '../users/entities/user.entity';
import { License } from '../lincese/entities/lincese.entity';
import { CreateStoreDto } from './dto/create-store.dto';
import { UpdateStoreDto } from './dto/update-store.dto';

@Injectable()
export class StoresService {

  constructor(private storeModel: DataSource) {


  }

  async createStoreWithAdmin(createStore, createUser) {

  }


  async create(createStoreDto: CreateStoreDto) {
    // const storeRepo = this.DataSource.getRepository(Store);
    // const store = storeRepo.create({
    //   name: createStoreDto.name,
    //   logo_url: createStoreDto.logo_url,
    //   description: createStoreDto.description,
    //   state: (createStoreDto.state as 'activa' | 'inactiva') ?? 'inactiva', // Usa 'inactiva' si no viene en el DTO
    // });
    // const savedStore = await storeRepo.save(store);
    // return savedStore;
  }
  // ...existing code...

  async findAll(): Promise<Store[]> {
    const storeRepo = this.storeModel.getRepository(Store);
    const store = await storeRepo.find(
      {
        relations: {
          users: true,
          // licenses: true,
        },
      }
    );

    if (!store || store.length === 0) {
      throw new NotFoundException('No stores found');
    }
    return store;
  }


  async findOne(id: string): Promise<Store | null> {

    const storeRepo = this.storeModel.getRepository(Store);
    const store = await storeRepo.findOne({
      where: { store_id: id },
      relations: {
        users: true,
        // licenses: true,
      },
    });

    if (!store) {
      throw new NotFoundException(`Store con ID ${id} no encontrada`);
    }
    return store;
  }


  async update(id: string, updateStoreDto: UpdateStoreDto): Promise<Store> {
    const storeRepo = this.storeModel.getRepository(Store);
    const store = await storeRepo.findOne({ where: { store_id: id } });

    if (!store) {
      throw new NotFoundException(`Store con ID ${id} no encontrada`);
    }

    Object.assign(store, updateStoreDto);
    return await storeRepo.save(store);
  }

  async remove(id: string): Promise<{ message: string }> {
    const storeRepo = this.storeModel.getRepository(Store);
    const store = await storeRepo.findOne({ where: { store_id: id } });

    if (store) {
      await storeRepo.remove(store);
      return { message: 'Store deleted successfully' };
    }
    return { message: 'Store not found' };
  }


}
