import { Controller,Req, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ShipmentService } from './shipment.service';
import { CreateShipmentDto } from './dto/create-shipment.dto';
import { UpdateShipmentDto } from './dto/update-shipment.dto';
import { CurrentUser, type RequestUser } from '../auth/decorators/current-user.decorator';
import { UserRole } from '@prisma/client';
import { Roles } from '../auth/decorators/roles.decorators';


@Controller('shipment')

export class ShipmentController {
  constructor(private readonly shipmentService: ShipmentService) {}



@Get('admin/all')
@Roles(UserRole.ADMIN)
findAllForAdmin(){
return this.shipmentService.findAllForAdmin();
}


@Get('admin/:id')
@Roles(UserRole.ADMIN)
findOneForAdmin(
@Param('id') id: string) {
return this.shipmentService.findOneForAdmin(id);
 }

@Patch('admin/:id')
@Roles(UserRole.ADMIN)
updateForAdmin( 
@Param('id') id: string, 
@Body() updateShipmentDto: UpdateShipmentDto, ) {
  return this.shipmentService.updateForAdmin( id, updateShipmentDto); }


@Delete('admin/:id')
@Roles(UserRole.ADMIN)
removeForAdmin(
@Param('id') id: string) { 
return this.shipmentService.removeForAdmin(id); 
  } 
//===========
//CUSTOMER
//======


  @Post()
  async create(@Req() req:any,
  @Body() createShipmentDto: CreateShipmentDto) {
    return this.shipmentService.create(createShipmentDto,req.user.id);
  }

  @Get('me')
  async findMyShipment(@Req() req:any) {
    return this.shipmentService.findMyShipment(req.use.id);
  }

  @Get(':id')
  findOne(@Req() req:any,
  @Param('id') id: string) {
    return this.shipmentService.findMyOne(req.user.id);
  }

  @Patch(':id')
  update(@Req() req:any,
  @Param('id') id: string, 
  @Body() updateShipmentDto: UpdateShipmentDto) {
    return this.shipmentService.update(
      id,req.user.id, updateShipmentDto);
  }

  @Delete(':id')
  remove(@Req() req:any,
  @Param('id') id: string) {
    return this.shipmentService.remove(id,req.user.id);
  }
}
