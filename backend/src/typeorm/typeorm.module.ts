import { Global, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppConfig } from 'src/app.config.provider';
import { Film } from 'src/films/entities/film.entity';
import { Schedule } from 'src/films/entities/schedule.entity';
import { FilmsRepository } from 'src/repository/films.repository';
import { ScheduleRepository } from 'src/repository/schedule.repository';

@Global()
@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      inject: ['CONFIG'],
      useFactory: (config: AppConfig) => ({
        type: 'postgres',
        host: new URL(config.database.url).hostname,
        port: parseInt(new URL(config.database.url).port, 10) || 5432,
        username: config.database.username,
        password: config.database.password,
        database: new URL(config.database.url).pathname.substring(1),
        entities: [Film, Schedule],
        synchronize: true,
      }),
    }),
    TypeOrmModule.forFeature([Film, Schedule]),
  ],
  providers: [FilmsRepository, ScheduleRepository],
  exports: [TypeOrmModule, FilmsRepository, ScheduleRepository],
})
export class TypeormModule {}
