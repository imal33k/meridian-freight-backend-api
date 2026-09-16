import { BadRequestException, ForbiddenException, Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';
import { SupabaseService } from '../supabase/supabase.services';


@Injectable()
export class CompanyService {
constructor(private readonly prisma: PrismaService, private supabaseService: SupabaseService) {}



async create(dto: CreateCompanyDto, userId: string){
    const existingCompany = await this.prisma.company.findUnique({
    where:{
        userId,
    },
});
  if (existingCompany){
    throw new ConflictException(
        'you already have a companyn registered',
    );
  }
    const {
        name,
        email,
        phone,
        registrationNumber,
        address,
        city,
        state,
        country,
    } = dto;

    return this.prisma.company.create({
        data: {
            name,
            email,
            phone,
            registrationNumber,
            address,
            city,
            state,
            country,
            userId,
        },
    });
}


async findMyCompany(userId: string, updatecompanydto: UpdateCompanyDto){
    const company = await this.prisma.company.findUnique({
    where: {
    userId,
    },
    });

    if (!company ) {
        throw new NotFoundException(
            'company not found,'
        );
    }
    return company;
}

async update (userId: string, dto: UpdateCompanyDto){
    const company = await this.prisma.company.findUnique({
        where: {
            userId,
        },
    });

    if (!company) {
        throw new NotFoundException(
            'company not found',
        );
    }
    return this.prisma.company.update({
        where: {
            userId,
        
        },
        data: {
            ...dto,
        },
    });

}


async remove(userId: string) {
  const company = await this.prisma.company.findUnique({
    where: {
        userId,
    },
});
  
if (!company) {
        throw new NotFoundException(
            'company not found',
        );
    }


  return {
    message: 'company deleted succesfully',
  };
}
}