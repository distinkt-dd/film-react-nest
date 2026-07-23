import { Test, TestingModule } from '@nestjs/testing';
import { FilmsRepository } from '../../repository/films.repository';
import { FilmsController } from '../films.controller';
import { FilmsService } from '../films.service';
import { fixtures } from './fixtures/films.fixtures';

describe('FilmsController', () => {
  let controller: FilmsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FilmsController],
      providers: [FilmsService],
    })
      .useMocker((token) => {
        if (token === FilmsRepository) {
          return {
            findAll: jest.fn().mockResolvedValue(fixtures.films.items),
            findById: jest.fn().mockResolvedValue({
              id: fixtures.film.id,
              schedules: fixtures.film.schedule,
            }),
          };
        }
        return undefined;
      })
      .compile();

    controller = module.get<FilmsController>(FilmsController);
  });

  it('Проверка поиска всех фильмов', async () => {
    expect(controller).toBeDefined();
    const result = await controller.getFilms();
    const expectedItems = fixtures.films.items.map((film) => ({
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
    expect(result).toEqual({
      total: expectedItems.length,
      items: expectedItems,
    });
  });

  it('Проверка вывода расписания', async () => {
    expect(controller).toBeDefined();
    const result = await controller.getFilmsById(
      '92b8a2a7-ab6b-4fa9-915b-d27945865e39',
    );
    expect(result).toEqual({
      total: fixtures.film.schedule.length,
      items: fixtures.film.schedule,
    });
  });
});
