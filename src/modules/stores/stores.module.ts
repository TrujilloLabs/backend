import { Module } from '@nestjs/common';
import { StoresService } from './stores.service';
import { StoresController } from './stores.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Store } from './entities/store.entity';

@Module({
  controllers: [StoresController],
  providers: [StoresService],
  imports: [
    TypeOrmModule.forFeature([Store]),

  ],
  exports: [StoresService],
})
export class StoresModule { }
