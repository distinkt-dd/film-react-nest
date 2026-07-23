import { ConflictException, NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getEntityManagerToken } from '@nestjs/typeorm';
import { ScheduleRepository } from 'src/repository/schedule.repository';
import { EntityManager } from 'typeorm';
import { CreateOrderDto } from '../dto/order.dto';
import { OrderController } from '../order.controller';
import { OrderService } from '../order.service';
import { orderFixtures } from './fixtures/order.fixtures';

describe('Контроллер заказов', () => {
  let controller: OrderController;
  let scheduleRepository: ScheduleRepository;
  let entityManager: EntityManager;

  beforeEach(async () => {
    const mockScheduleRepository = {
      addTakenSeat: jest.fn().mockResolvedValue(undefined),
    };
    const mockEntityManager = {
      transaction: jest.fn().mockImplementation(async (callback) => {
        return callback(mockEntityManager);
      }),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [OrderController],
      providers: [OrderService],
    })
      .useMocker((token) => {
        if (token === ScheduleRepository) {
          return mockScheduleRepository;
        }
        if (token === getEntityManagerToken()) {
          return mockEntityManager;
        }
        return undefined;
      })
      .compile();

    controller = module.get<OrderController>(OrderController);
    scheduleRepository = module.get<ScheduleRepository>(ScheduleRepository);
    entityManager = module.get<EntityManager>(EntityManager);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('должен быть определен', () => {
    expect(controller).toBeDefined();
  });

  describe('Создание заказа', () => {
    it('должен успешно создать заказ', async () => {
      const result = await controller.createOrder(orderFixtures.validOrderDto);

      expect(result).toEqual({
        total: 1,
        items: [
          {
            ...orderFixtures.ticket,
            id: expect.any(String),
          },
        ],
      });

      expect(scheduleRepository.addTakenSeat).toHaveBeenCalledTimes(1);
      expect(scheduleRepository.addTakenSeat).toHaveBeenCalledWith(
        entityManager,
        orderFixtures.ticket.session,
        `${orderFixtures.ticket.row}:${orderFixtures.ticket.seat}`,
      );
      expect(entityManager.transaction).toHaveBeenCalledTimes(1);
    });

    it('должен выбрасывать ConflictException при дублировании места в одном заказе', async () => {
      const duplicateDto: CreateOrderDto = {
        email: 'test@example.com',
        phone: '+79991234567',
        tickets: [orderFixtures.ticket, { ...orderFixtures.ticket, seat: 10 }],
      };

      await expect(controller.createOrder(duplicateDto)).rejects.toThrow(
        ConflictException,
      );
      expect(scheduleRepository.addTakenSeat).not.toHaveBeenCalled();
      expect(entityManager.transaction).not.toHaveBeenCalled();
    });

    it('должен выбрасывать ConflictException, если место уже занято', async () => {
      (scheduleRepository.addTakenSeat as jest.Mock).mockRejectedValueOnce(
        new ConflictException('Место 5:10 уже занято'),
      );

      await expect(
        controller.createOrder(orderFixtures.validOrderDto),
      ).rejects.toThrow(ConflictException);
      expect(scheduleRepository.addTakenSeat).toHaveBeenCalledTimes(1);
      expect(entityManager.transaction).toHaveBeenCalledTimes(1);
    });

    it('должен выбрасывать NotFoundException, если расписание не найдено', async () => {
      (scheduleRepository.addTakenSeat as jest.Mock).mockRejectedValueOnce(
        new NotFoundException('Расписание не найдено'),
      );

      await expect(
        controller.createOrder(orderFixtures.validOrderDto),
      ).rejects.toThrow(NotFoundException);
      expect(scheduleRepository.addTakenSeat).toHaveBeenCalledTimes(1);
      expect(entityManager.transaction).toHaveBeenCalledTimes(1);
    });

    it('должен обрабатывать несколько билетов в одном заказе', async () => {
      const multiTicketDto: CreateOrderDto = {
        email: 'test@example.com',
        phone: '+79991234567',
        tickets: [
          { ...orderFixtures.ticket, row: 5, seat: 10 },
          { ...orderFixtures.ticket, row: 6, seat: 12 },
        ],
      };

      const result = await controller.createOrder(multiTicketDto);

      expect(result.total).toBe(2);
      expect(result.items).toHaveLength(2);
      expect(scheduleRepository.addTakenSeat).toHaveBeenCalledTimes(2);
      expect(scheduleRepository.addTakenSeat).toHaveBeenNthCalledWith(
        1,
        entityManager,
        orderFixtures.ticket.session,
        '5:10',
      );
      expect(scheduleRepository.addTakenSeat).toHaveBeenNthCalledWith(
        2,
        entityManager,
        orderFixtures.ticket.session,
        '6:12',
      );
    });
  });
});
