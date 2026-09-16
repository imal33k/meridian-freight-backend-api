import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Req,
} from '@nestjs/common';
import { CompanyService } from './company.service';
import { CreateCompanyDto } from './dto/create-company.dto';
import { CurrentUser, type RequestUser } from '../auth/decorators/current-user.decorator';
import { UpdateCompanyDto } from './dto/update-company.dto';

@Controller('company') 

export class CompanyController{
    constructor (private readonly companyService: CompanyService) {}

    @Post()
    async create(@Req() req:any,
    @Body() createCompanyDto: CreateCompanyDto, @CurrentUser() user: RequestUser){
        return this.companyService.create(createCompanyDto,req.user.id);
    }

  @Get('me')
  async findMyCompany(@Req() req: any) {
    return this.companyService.findMyCompany(
        req.user.id,
        UpdateCompanyDto,
    );

  }

  @Patch()
  async update(
    @Req() req: any,
    @Body() updateCompanytDto: UpdateCompanyDto,
  ) {
    return this.companyService.update(req.user.id, updateCompanytDto);
  }

  @Delete()
  async remove(@Req() req: any){

    return this.companyService.remove(req.user.id
  );
}
}