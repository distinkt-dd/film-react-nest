import { IsArray, IsISO8601, IsNumber, IsString, Min } from 'class-validator';

export class ScheduleDto {
  @IsString()
  readonly id: string;

  @IsISO8601()
  readonly daytime: Date | string;

  @IsNumber()
  @Min(0)
  readonly hall: number;

  @IsNumber()
  @Min(1)
  readonly rows: number;

  @IsNumber()
  @Min(1)
  readonly seats: number;

  @IsNumber()
  @Min(0)
  readonly price: number;

  @IsArray()
  @IsString({ each: true })
  readonly taken: string[];
}
