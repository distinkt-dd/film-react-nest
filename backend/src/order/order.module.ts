import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { FilmsModule } from 'src/films/films.module';
import { Film, FilmSchema } from 'src/films/schemas/film.schema';
import { OrderController } from './order.controller';
import { OrderService } from './order.service';

@Module({
  controllers: [OrderController],
  providers: [OrderService],
  imports: [
    FilmsModule,
    MongooseModule.forFeature([{ name: Film.name, schema: FilmSchema }]),
  ],
})
export class OrderModule {}
