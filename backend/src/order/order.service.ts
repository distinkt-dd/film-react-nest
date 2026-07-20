import { ConflictException, Injectable } from '@nestjs/common';
import { InjectEntityManager } from '@nestjs/typeorm';
import { randomUUID } from 'crypto';
import { ScheduleRepository } from 'src/repository/schedule.repository';
import { EntityManager } from 'typeorm';
import { CreateOrderDto } from './dto/order.dto';

@Injectable()
export class OrderService {
  constructor(
    private readonly scheduleRepository: ScheduleRepository,
    @InjectEntityManager() private readonly entityManager: EntityManager,
  ) {}

  async createOrder(dto: CreateOrderDto) {
    const seen = new Set<string>();
    for (const ticket of dto.tickets) {
      const key = `${ticket.session}|${ticket.row}:${ticket.seat}`;
      if (seen.has(key)) {
        throw new ConflictException(
          `Дубликат места: ряд ${ticket.row}, место ${ticket.seat} для сеанса ${ticket.session}`,
        );
      }
      seen.add(key);
    }

    return await this.entityManager.transaction(
      async (transactionalEntityManager) => {
        const results = [];

        for (const ticket of dto.tickets) {
          const seatKey = `${ticket.row}:${ticket.seat}`;
          await this.scheduleRepository.addTakenSeat(
            transactionalEntityManager,
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
      },
    );
  }
}
