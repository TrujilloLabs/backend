import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

// import { AuthModule } from './auth/auth.module';
// import { StoresModule } from './stores/stores.module';
import { AuthModule } from './modules/auth/auth.module';
import { StoresModule } from './modules/stores/stores.module';
import { UsersModule } from './modules/users/users.module';
import { LinceseModule } from './modules/lincese/lincese.module';
import { SeedModule } from './modules/seed/seed.module';
import { ProductResolver } from './modules/product/product.resolver';
import { CategoriesModule } from './modules/categories/categories.module';
import { ProductModule } from './modules/product/product.module';
import { ProductResolver } from './modules/product/product.resolver';
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
  }),

  AuthModule,

  StoresModule,

  UsersModule,

  LinceseModule,

  SeedModule,

  ProductModule,

  CategoriesModule
  ],
  providers: [ProductResolver],
  // controllers: [AppController],
  // providers: [AppService],
})
export class AppModule { }
