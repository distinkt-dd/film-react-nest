import { Injectable, NotFoundException } from '@nestjs/common';
import { FilmsRepository } from 'src/repository/films.repository';

@Injectable()
export class FilmsService {
  constructor(private readonly filmsRepository: FilmsRepository) {}
  async findAll() {
    const films = await this.filmsRepository.findAll();

    const items = films.map((film) => {
      const { _id, schedule, ...other } = film;

      return other;
    });

    return {
      total: items.length,
      items,
    };
  }

  async findById(id: string) {
    const film = await this.filmsRepository.findById(id);
    if (!film) {
      throw new NotFoundException('Фильм не найден!');
    }
    return {
      total: film.schedule.length,
      items: film.schedule,
    };
  }
}
