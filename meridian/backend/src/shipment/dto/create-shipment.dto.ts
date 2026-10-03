import { RequestType, TransportMethod } from '@prisma/client';
import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  IsUUID,
  ValidateNested,
} from 'class-validator';
import { CreateShipmentItemDto } from '../../shipment-item/dto/create-shipment-item.dto';
import { Type } from 'class-transformer';

export class CreateShipmentDto {
  @IsEnum(RequestType)
  shipmentType!: RequestType;

  @IsOptional()
  @IsEnum(TransportMethod)
  transportMethod?: TransportMethod;

  @IsString()
  @IsNotEmpty()
  originCountry!: string;

  @IsOptional()
  @IsString()
  originCity?: string;

  @IsString()
  @IsNotEmpty()
  destinationCountry!: string;

  @IsOptional()
  @IsString()
  destinationCity?: string;

  @IsString()
  @IsNotEmpty()
  description!: string;

  @IsOptional()
@ValidateNested({ each: true })
@Type(() => CreateShipmentItemDto)
items?: CreateShipmentItemDto[];

  @IsString()
  @IsNotEmpty()
  goodsType!: string;

  @IsOptional()
  @IsNumber()
  @IsPositive()
  weight?: number;

  @IsOptional()
  @IsString()
  weightUnit?: string;

  @IsOptional()
  @IsUUID()
  requestId?: string;
}
