import { RequestType, TransportMethod } from '@prisma/client';
import { IsEnum, IsNotEmpty, IsNumber, IsOptional, IsPositive, IsString } from 'class-validator';

export class CreateRequestDto {
  @IsEnum(RequestType)
  type!: RequestType;

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
  goodsType!: string;

  @IsString()
  @IsNotEmpty()
  cargoDescription!: string;

  @IsOptional()
  @IsString()
  quantityText?: string;

  @IsNumber()
  @IsPositive()
  weightKg!: number;

  @IsOptional()
  @IsString()
  dimensions?: string;

  @IsEnum(TransportMethod)
  transportMethod!: TransportMethod;

  @IsOptional()
  @IsString()
  pickupAddress?: string;

  @IsOptional()
  @IsString()
  deliveryAddress?: string;

  @IsOptional()
  @IsString()
  additionalInfo?: string;
}
