import { Controller, Get, Param, ParseUUIDPipe } from '@nestjs/common';
import { FilmsService } from './films.service';

@Controller('films')
export class FilmsController {
  constructor(private readonly filmsService: FilmsService) {}

  @Get()
  async getFilms() {
    return await this.filmsService.findAll();
  }

  @Get(':id/schedule')
  async getFilmsById(@Param('id', ParseUUIDPipe) id: string) {
    return await this.filmsService.findById(id);
  }
}
