import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { CreateAuthDto } from './dto/create-auth.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { CreateStoreDto } from '../stores/dto/create-store.dto';
// import { AuthStore } from '../../../dist/interfaces/auth-store.interface';
import { Store } from '../stores/entities/store.entity';
import { User } from '../users/entities/user.entity';
import { Role } from '../users/enums/user-role.enum';
// import { async } from '../seed/seed-superadmin';




@Injectable()
export class AuthService {
  constructor(
    private readonly dataSource: DataSource

  ) { }


  async authCreateStore(createStoreDto: CreateStoreDto) {
    const storeRepo = this.dataSource.getRepository(Store);
    const store = storeRepo.create({
      name: createStoreDto.name,
      logo_url: createStoreDto.logo_url,
      description: createStoreDto.description,
      email: createStoreDto.email,
      password: createStoreDto.password,
      // state: (createStoreDto.state as 'activa' | 'inactiva') ?? 'inactiva', // Usa 'inactiva' si no viene en el DTO
    });

    //crear usario con el email el password en name de store
    const userRepo = this.dataSource.getRepository(User),
      user = userRepo.create({
        name: createStoreDto.name,
        email: createStoreDto.email,
        password: createStoreDto.password,
        role: Role.ADMIN_TIENDA,
      });

    const savedStore = await storeRepo.save(store);
    const savedUser = await this.dataSource.getRepository(User).save(user);

  }

  findAll() {
    return `This action returns all auth`;
  }

  findOne(id: number) {
    return `This action returns a #${id} auth`;
  }

  update(id: number, updateAuthDto: UpdateAuthDto) {
    return `This action updates a #${id} auth`;
  }

  remove(id: number) {
    return `This action removes a #${id} auth`;
  }
}
