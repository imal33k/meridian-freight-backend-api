import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateShipmentDto } from './dto/create-shipment.dto';
import { UpdateShipmentDto } from './dto/update-shipment.dto';
import { SupabaseService } from '../supabase/supabase.services';
import { PrismaService } from '../database/prisma.service';

@Injectable()
export class ShipmentService {

  constructor(private readonly prisma: PrismaService, private readonly supabaseservice:SupabaseService){}


async create(dto: CreateShipmentDto, userId: string){
  const trackingNumber = this.generateTrackingNumber();
  const requestReference = this.generateRequestReference();

  
    const {
        shipmentType,
        originCountry,
        destinationCountry,
        description,
        goodsType,
       requestId,
        
    } = dto;

    return this.prisma.shipment.create({
        data: {
        shipmentType,
        originCountry,
        destinationCountry,
        description,
        goodsType,
        trackingNumber,
        requestReference,
        ...(requestId
        ? {
          request: { connect: { id: requestId}}}
          :{}),
        // Connect shipment to logged-in user
        user: { connect: { id: userId } },
        },
    });
}

async findMyShipment(userId: string){
const shipment = await this.prisma.findMany({
where: { 
  userId,
},
orderBy: {
  createdAt: 'desc',
},
});
}

async findMyOne( userId: string) { 
const shipment = await this.prisma.shipment.findFirst({
where: {
  userId,
},
});


if (!shipment) {
   throw new NotFoundException('Shipment not found');
  }
  return shipment; 


}

async update (id: string, userId: string, dto: UpdateShipmentDto ){
    const shipment = await this.prisma.shipment.findFirst({
        where: {
            userId,
        },
    });

    if (!shipment) {
        throw new NotFoundException(
            'shipment not found',
        );
    }
    return this.prisma.shipment.update({
        where: {
          id,
        },
        data: {
            ...dto,
        },
    });

}


async remove(id: string, userId: string) {
  const shipment = await this.prisma.shipment.findFirst({
    where: {
      id,
        userId,
    },
});
  
if (!shipment) {
        throw new NotFoundException(
            'shipment not found',
        );
    }


  return {
    message: 'shipment deleted succesfully',
  };
}



async findAllForAdmin(){
  return this.prisma.shipment.findMany({

    include: {
      user: {
        select: {id: true,email:true}
      },
    },
  });
}

async findOneForAdmin(id: string){
  const shipment = await this.prisma.shipment.findUnique({
    where:{
      id,
    },
    include: {
      user: {
        select:{
          id: true,
          email: true,
        },
      },
      trackingEvents: true,
    },
  });
  if (!shipment){
    throw new NotFoundException(' Shipment not found nigga');
  }
  return shipment;

}
async updateForAdmin(id: string, dto: UpdateShipmentDto){
const shipment = await this.prisma.shipment.findUnique({
  where: {
    id},
});

if (!shipment) {
  throw new NotFoundException('shipment not found');
}

return this.prisma.shipment.update({
  where:{
    id,
  },
  data:{
    ...dto,
  },
});
}

async removeForAdmin( id: string){
  const shipment = await this.prisma.shipment.findUnique({
    where: {id},
  });
if (!shipment){
  throw new NotFoundException(' Shipment Not Shipment');

}
await this.prisma.shipment.delete({
  where: {id},
});

return {message:' shipment deleted succesfully',

};
}

private generateTrackingNumber(): string {
  const randomPart = Math.random()
    .toString(36)
    .substring(2,10)
    .toUpperCase();

  return 'MER-${Date.now()}-${randomPart}';
 

}

private generateRequestReference(): string {
  const randomPart = Math.random()
    .toString(36)
    .substring(2, 10)
    .toUpperCase();

  return `MER-REQ-${randomPart}`;
}
}
