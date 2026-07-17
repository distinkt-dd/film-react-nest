import { Type } from 'class-transformer';
import {
  IsArray,
  IsNumber,
  IsString,
  IsUUID,
  Max,
  Min,
  ValidateNested,
} from 'class-validator';
import { ScheduleDto } from './schedule.dto';

export class FilmDto {
  @IsUUID()
  readonly id: string;

  @IsNumber()
  @Min(0)
  @Max(10)
  readonly rating: number;

  @IsString()
  readonly director: string;

  @IsArray()
  @IsString({ each: true })
  readonly tags: string[];

  @IsString()
  readonly image: string;

  @IsString()
  readonly cover: string;

  @IsString()
  readonly title: string;

  @IsString()
  readonly about: string;

  @IsString()
  readonly description: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ScheduleDto)
  readonly schedule: ScheduleDto[];
}
