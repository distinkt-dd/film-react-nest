import { Global, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { configProvider } from './app.config.provider';
import { TypeormModule } from './typeorm/typeorm.module';

@Global()
@Module({
  providers: [configProvider],
  exports: [configProvider],
  imports: [TypeormModule],
})
export class AppConfigModule {}
