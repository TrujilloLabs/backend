import { Injectable, NotFoundException } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcryptjs';

import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';


@Injectable()
export class UsersService {

  constructor(
    private userModel: DataSource) {
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

  findAll() {
    return `This action returns all users`;
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
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