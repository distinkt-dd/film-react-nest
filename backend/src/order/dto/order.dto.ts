import { Type } from 'class-transformer';
import {
  IsArray,
  IsEmail,
  IsInt,
  IsNumber,
  IsString,
  IsUUID,
  Min,
  ValidateNested,
} from 'class-validator';

class TicketDto {
  @IsUUID()
  readonly film: string;

  @IsUUID()
  readonly session: string;

  @IsString()
  readonly daytime: string;

  @IsString()
  readonly day: string;

  @IsString()
  readonly time: string;

  @IsInt()
  @Min(1)
  readonly row: number;

  @IsInt()
  @Min(1)
  readonly seat: number;

  @IsNumber()
  readonly price: number;
}

export class CreateOrderDto {
  @IsEmail()
  readonly email: string;

  @IsString()
  readonly phone: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => TicketDto)
  readonly tickets: TicketDto[];
}
