import { Body, Controller, Delete, Get, Patch, Post } from '@nestjs/common';
import { CompanyService } from './company.service';
import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';
import { CurrentUser, type RequestUser } from '../auth/decorators/current-user.decorator';

@Controller('company')
export class CompanyController {
  constructor(private readonly companyService: CompanyService) {}

  @Post()
  create(@CurrentUser() user: RequestUser, @Body() dto: CreateCompanyDto) {
    return this.companyService.create(dto, user.id);
  }

  @Get('me')
  findMyCompany(@CurrentUser() user: RequestUser) {
    return this.companyService.findMyCompany(user.id);
  }

  @Patch()
  update(@CurrentUser() user: RequestUser, @Body() dto: UpdateCompanyDto) {
    return this.companyService.update(user.id, dto);
  }

  @Delete()
  remove(@CurrentUser() user: RequestUser) {
    return this.companyService.remove(user.id);
  }
}
