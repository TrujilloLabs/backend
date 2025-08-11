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
    database: process.env.DB_NAME,
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    autoLoadEntities: true,
    synchronize: true,  // Disable this in production
  })
  ],
  // controllers: [AppController],
  // providers: [AppService],
})
export class AppModule { }
