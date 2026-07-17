import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { AppConfigModule } from './app.config.module';
import { FilmsModule } from './films/films.module';
import { OrderModule } from './order/order.module';
import { TypeormModule } from './typeorm/typeorm.module';
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      cache: true,
    }),
    AppConfigModule,
    TypeormModule,
    FilmsModule,
    OrderModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
