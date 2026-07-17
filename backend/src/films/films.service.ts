import { Injectable } from '@nestjs/common';
import { FilmsRepository } from 'src/repository/films.repository';

@Injectable()
export class FilmsService {
  constructor(private readonly filmsRepository: FilmsRepository) {}
  async findAll() {
    const films = await this.filmsRepository.findAll();

    const items = films.map((film) => ({
      id: film.id,
      title: film.title,
      rating: film.rating,
      director: film.director,
      tags: film.tags,
      image: film.image,
      cover: film.cover,
      about: film.about,
      description: film.description,
    }));

    return {
      total: items.length,
      items,
    };
  }

  async findById(id: string) {
    const film = await this.filmsRepository.findById(id);

    return {
      total: film.schedules.length,
      items: film.schedules,
    };
  }
}
