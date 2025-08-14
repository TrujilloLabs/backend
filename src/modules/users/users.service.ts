import { Injectable, NotFoundException } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';


@Injectable()
export class UsersService {

  constructor(
    private userModel: DataSource) {
  }




  create(createUserDto: CreateUserDto) {
    return 'This action adds a new user';
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
    const user = await this.userModel.getRepository(User).findOne({ where: { email } });
    if (!user) throw new NotFoundException(`User with email ${email} not found`);
    return {
      user_id: user.user_id,
      name: user.name,
      email: user.email,
      password: user.password,
      telephone: user.telephone,
      address: user.address,
      registration_date: user.registration_date,
      role: user.role,
      store: user.store
    };
  }
}
