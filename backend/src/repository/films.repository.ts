import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Film } from 'src/films/entities/film.entity';
import { Repository } from 'typeorm';

@Injectable()
export class FilmsRepository {
  constructor(
    @InjectRepository(Film) private filmRepository: Repository<Film>,
  ) {}

  async findAll() {
    return await this.filmRepository.find();
  }

  async findById(id: string) {
    const film = await this.filmRepository.findOne({
      where: { id },
      relations: ['schedules'],
    });

    if (!film) {
      throw new NotFoundException('Фильм не найден!');
    }
    return film;
  }
}
