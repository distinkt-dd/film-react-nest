import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { randomUUID } from 'node:crypto';
import { FilmsRepository } from 'src/repository/films.repository';
import { ScheduleRepository } from 'src/repository/schedule.repository';
import { CreateOrderDto } from './dto/order.dto';

@Injectable()
export class OrderService {
  constructor(
    private readonly scheduleRepository: ScheduleRepository,
    private readonly filmRepository: FilmsRepository,
  ) {}

  async createOrder(dto: CreateOrderDto) {
    const results = [];

    for (const ticket of dto.tickets) {
      const film = await this.filmRepository.findById(ticket.film);

      if (!film) {
        throw new NotFoundException(`Фильм с id ${ticket.film} не найден!`);
      }

      const session = film.schedules.find((s) => s.id === ticket.session);
      if (!session)
        throw new NotFoundException(`Сеанс ${ticket.session} не найден`);

      const seatKey = `${ticket.row}:${ticket.seat}`;

      if (session.taken.includes(seatKey)) {
        throw new ConflictException(
          `Ряд ${ticket.row}, место: ${ticket.seat} уже заянто`,
        );
      }

      await this.scheduleRepository.addTakenSeat(
        ticket.film,
        ticket.session,
        seatKey,
      );

      results.push({
        ...ticket,
        id: randomUUID(),
      });
    }

    return {
      total: results.length,
      items: results,
    };
  }
}
