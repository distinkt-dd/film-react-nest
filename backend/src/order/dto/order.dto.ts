import { Type } from 'class-transformer';
import {
  IsArray,
  IsEmail,
  IsInt,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  Min,
  ValidateNested,
} from 'class-validator';

export class TicketDto {
  @IsUUID()
  readonly film: string;

  @IsUUID()
  readonly session: string;

  @IsString()
  readonly daytime: string;

  @IsString()
  @IsOptional()
  readonly day: string;

  @IsString()
  @IsOptional()
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
