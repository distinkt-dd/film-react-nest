import { JsonLogger } from './json.logger';

describe('json-logger', () => {
  let log: jest.SpyInstance;
  const jsonLogger = new JsonLogger();

  beforeEach(() => {
    log = jest.spyOn(console, 'log').mockImplementation(() => {});
  });

  afterEach(() => {
    log.mockReset();
  });

  it('Проверка, что json - лог выводится в корректном формате', () => {
    jsonLogger.warn('Проверка', { param1: 'param1', param2: 2 });
    expect(log).toBeCalledTimes(1);
    expect(log).toBeCalledWith(
      '{\"level\":\"warn\",\"message\":\"Проверка\",\"optionalParams\":[[{\"param1\":\"param1\",\"param2\":2}]]}',
    );
  });
});
