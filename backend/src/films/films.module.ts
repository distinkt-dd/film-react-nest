import { Module } from '@nestjs/common';
import { TypeormModule } from 'src/typeorm/typeorm.module';
import { FilmsController } from './films.controller';
import { FilmsService } from './films.service';

@Module({
  controllers: [FilmsController],
  providers: [FilmsService],
  imports: [TypeormModule],
})
export class FilmsModule {}
