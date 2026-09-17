import { RequestType } from "@prisma/client";
import { IsEnum,IsString, IsNotEmpty, IsOptional, IsNumber,  } from "class-validator";


export class CreateShipmentDto {

    @IsString()
    @IsNotEmpty()
    shipmentType!: string;

    @IsEnum(RequestType)
    requestType!: RequestType;

    @IsString()
    @IsNotEmpty()
    originCountry !: string;

    @IsString()
    @IsNotEmpty()
    destinationCountry!: string;

    @IsString()
    @IsOptional()
    originCity?: string

    @IsString()
    @IsOptional()
    destinationCity?: string;

    @IsString()
    @IsNotEmpty()
    description!: string;

    @IsString()
    @IsNotEmpty()
    goodsType!: string;

   @IsOptional() 
   @IsNumber() 
   weight?: number;

   @IsOptional() 
   @IsString() 
   weightUnit?: string;
    
   @IsOptional() 
   @IsString() 
   requestId?: string;

    @IsString()
    @IsNotEmpty()
    pickupAddress?: string;

    @IsString()
    @IsNotEmpty()
    deliveryAddress?: string;

}














