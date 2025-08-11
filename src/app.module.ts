import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true, }),

  TypeOrmModule.forRoot({
    type: 'postgres',
    host: process.env.DB_HOST,
    // port: +process.env.DB_PORT,
    port: +(process.env.DB_PORT ?? 5432), // Default to 5432 if undefined
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    autoLoadEntities: true,
    synchronize: true,
  })
  ],
  // controllers: [AppController],
  // providers: [AppService],
})
export class AppModule { }
