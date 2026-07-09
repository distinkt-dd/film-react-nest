import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { FilmsRepository } from 'src/repository/films.repository';
import { FilmsController } from './films.controller';
import { FilmsService } from './films.service';
import { Film, FilmSchema } from './schemas/film.schema';

@Module({
  controllers: [FilmsController],
  providers: [FilmsService, FilmsRepository],
  imports: [
    MongooseModule.forFeature([{ name: Film.name, schema: FilmSchema }]),
  ],
  exports: [FilmsRepository],
})
export class FilmsModule {}
