import { Module } from '@nestjs/common';
import { LinceseService } from './lincese.service';
import { LinceseController } from './lincese.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { License } from './entities/lincese.entity';

@Module({
  controllers: [LinceseController],
  providers: [LinceseService],
  imports: [
    TypeOrmModule.forFeature([License]),
  ]
})
export class LinceseModule { }
