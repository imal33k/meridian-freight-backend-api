import { RequestStatus } from '@prisma/client';
import { IsEnum, IsNumber, IsOptional, IsPositive, IsString, Length } from 'class-validator';

export class AdminUpdateRequestDto {
  @IsOptional()
  @IsEnum(RequestStatus)
  status?: RequestStatus;

  @IsOptional()
  @IsNumber()
  @IsPositive()
  quoteAmount?: number;

  @IsOptional()
  @IsString()
  @Length(3, 3)
  quoteCurrency?: string;

  @IsOptional()
  @IsString()
  quoteNotes?: string;
}
