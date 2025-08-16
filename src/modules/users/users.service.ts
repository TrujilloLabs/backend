import { Injectable, NotFoundException } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcryptjs';

import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { StoresService } from '../stores/stores.service';


@Injectable()
export class UsersService {

  constructor(
    private userModel: DataSource,
    private storesService: StoresService) {
  }




  async create(createUserDto: CreateUserDto, storeId: string) {
    // const hashedPass = await bcrypt.hash(createUserDto.password, 10);

    const user = this.userModel.getRepository(User).create({
      ...createUserDto,
      password: createUserDto.password, // Assuming password is already hashed
      store: { store_id: storeId }
    });

    await this.userModel.getRepository(User).save(user);

    return user;
  }

  async findAll(storeId: string) {

    //Validar la el id de la tienda si existe 
    const storeValidate = await this.storesService.findOne(storeId);
    if (!storeValidate) {
      throw new NotFoundException(`Store with id ${storeId} not found`);
    }
    const userRepo = this.userModel.getRepository(User);
    const user = await userRepo.find({
      relations: ['store']
    });

    if (!user) throw new NotFoundException(`No users found for store ${storeId}`);

    return user;


  }

  async findOne(id: string, storeId: string): Promise<User> {

    //Validar la el id de la tienda si existe 
    const storeValidate = await this.storesService.findOne(storeId);

    const user = await this.userModel.getRepository(User)
      .createQueryBuilder('user')  // esta linea lo que hace es que crea una consulta para buscar un usuario
      .leftJoinAndSelect('user.store', 'store') // esta linea lo que hace es que une la tabla de usuarios con la tabla de tiendas
      .where('user.user_id = :id', { id })     // esta linea lo que hace es que busca un usuario por su id
      .andWhere('user.store = :storeId', { storeId })   // esta linea lo que hace es que busca un usuario por su id de tienda OSEA que al buscar el id de tienda valida que exista el usuario
      .getOne();

    if (!user) throw new NotFoundException(`User with id ${id} not found in store ${storeId}`);
    return user;

  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;

  }

  async findByEmail(email: string): Promise<User | null> {


    const user = await this.userModel.getRepository(User).findOne({ where: { email }, relations: ['store'] });

    if (!user) throw new NotFoundException(`User with email ${email} not found`);
    return user;
  }



}