import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { FilmsRepository } from 'src/repository/films.repository';
import { v4 } from 'uuid';
import { CreateOrderDto } from './dto/order.dto';

@Injectable()
export class OrderService {
  constructor(private readonly filmsRepository: FilmsRepository) {}

  async createOrder(dto: CreateOrderDto) {
    const results = [];

    for (const ticket of dto.tickets) {
      const film = await this.filmsRepository.findById(ticket.film);

      if (!film) {
        throw new NotFoundException(`Фильм с id ${ticket.film} не найден!`);
      }

      const session = film.schedule.find((s) => s.id === ticket.session);
      if (!session)
        throw new NotFoundException(`Сеанс ${ticket.session} не найден`);

      const seatKey = `${ticket.row}:${ticket.seat}`;

      if (session.taken.includes(seatKey)) {
        throw new ConflictException(
          `Ряд ${ticket.row}, место: ${ticket.seat} уже заянто`,
        );
      }

      await this.filmsRepository.addTakenSeat(
        ticket.film,
        ticket.session,
        seatKey,
      );

      results.push({
        ...ticket,
        id: v4(),
      });
    }

    return {
      total: results.length,
      items: results,
    };
  }
}
