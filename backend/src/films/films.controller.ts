import { Controller, Get, Param } from '@nestjs/common';
import { FilmsService } from './films.service';

@Controller('films')
export class FilmsController {
  constructor(private readonly filmsService: FilmsService) {}

  @Get()
  async getFilms() {
    return await this.filmsService.findAll();
  }

  @Get(':id/schedule')
  async getFilmsById(@Param('id') id: string) {
    return await this.filmsService.findById(id);
  }
}
