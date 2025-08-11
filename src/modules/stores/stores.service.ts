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

  create(createStoreDto: CreateStoreDto) {
    return 'This action adds a new store';
  }

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
