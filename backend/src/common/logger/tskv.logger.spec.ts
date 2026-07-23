import { TskvLogger } from './tskv.logger';

describe.only('TskvLogger', () => {
  let log: jest.SpyInstance;
  const tskvLogger = new TskvLogger();

  beforeEach(() => {
    log = jest.spyOn(console, 'log').mockImplementation(() => {});
  });

  afterEach(() => {
    log.mockReset();
  });

  it('Проверка что лог - tskv выводится в корректном формате', () => {
    tskvLogger.warn('Проверка', { param1: 'param1', param2: 2 });
    expect(log).toBeCalledTimes(1);
    expect(log).toBeCalledWith(
      'level=warn\tmessage=Проверка\toptional=[[{"param1":"param1","param2":2}]]',
    );
  });
});
