import { OmitType, PartialType } from '@nestjs/swagger';
import { CreateShipmentDto } from './create-shipment.dto';

// Customers can edit shipment details, but cannot re-link the trade request.
export class UpdateShipmentDto extends PartialType(
  OmitType(CreateShipmentDto, ['requestId'] as const),
) {}
