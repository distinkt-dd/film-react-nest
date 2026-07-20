import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Schedule } from 'src/films/entities/schedule.entity';
import { EntityManager, Repository } from 'typeorm';

@Injectable()
export class ScheduleRepository {
  constructor(
    @InjectRepository(Schedule)
    private scheduleRepository: Repository<Schedule>,
  ) {}

  async addTakenSeat(
    manager: EntityManager,
    sessionId: string,
    seatKey: string,
  ): Promise<void> {
    const schedule = await manager
      .createQueryBuilder(Schedule, 'schedule')
      .setLock('pessimistic_write')
      .where('schedule.id = :sessionId', { sessionId })
      .getOne();

    if (!schedule) {
      throw new NotFoundException('Расписание не найдено');
    }

    if (schedule.taken.includes(seatKey)) {
      throw new ConflictException(`Место ${seatKey} уже занято`);
    }

    schedule.taken.push(seatKey);
    await manager.save(schedule);
  }
}
