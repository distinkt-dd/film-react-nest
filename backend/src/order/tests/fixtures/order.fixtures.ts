import { CreateOrderDto, TicketDto } from 'src/order/dto/order.dto';

const ticket: TicketDto = {
  film: 'film-uuid-1',
  session: 'session-uuid-1',
  daytime: '2026-07-22T10:00:00Z',
  day: '2026-07-22',
  time: '10:00',
  row: 5,
  seat: 10,
  price: 350,
};

const validOrderDto: CreateOrderDto = {
  email: 'test@example.com',
  phone: '+79991234567',
  tickets: [ticket],
};

export const orderFixtures = {
  validOrderDto,
  ticket,
};
