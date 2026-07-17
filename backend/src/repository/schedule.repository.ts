import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Schedule } from 'src/films/entities/schedule.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ScheduleRepository {
  constructor(
    @InjectRepository(Schedule)
    private scheduleRepository: Repository<Schedule>,
  ) {}

  private async findScheduleByFilmIdAndSessionId(
    filmId: string,
    sessionId: string,
  ) {
    const schedule = await this.scheduleRepository.findOne({
      where: {
        film: { id: filmId },
        id: sessionId,
      },
    });

    if (!schedule) {
      throw new NotFoundException('Не найдено расписание!');
    }

    return schedule;
  }

  async addTakenSeat(
    filmId: string,
    sessionId: string,
    seatKey: string,
  ): Promise<void> {
    const schedule = await this.findScheduleByFilmIdAndSessionId(
      filmId,
      sessionId,
    );
    const takens = schedule.taken;
    takens.push(seatKey);

    await this.scheduleRepository.update(sessionId, { taken: takens });
  }
}
