import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../database/prisma.service';
import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';

@Injectable()
export class CompanyService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateCompanyDto, userId: string) {
    const existing = await this.prisma.company.findUnique({ where: { userId } });
    if (existing) {
      throw new ConflictException('You already have a company registered');
    }

    try {
      return await this.prisma.company.create({ data: { ...dto, userId } });
    } catch (err) {
      this.rethrowUniqueViolation(err);
      throw err;
    }
  }

  async findMyCompany(userId: string) {
    const company = await this.prisma.company.findUnique({ where: { userId } });
    if (!company) {
      throw new NotFoundException('Company not found');
    }
    return company;
  }

  async update(userId: string, dto: UpdateCompanyDto) {
    await this.findMyCompany(userId);
    try {
      return await this.prisma.company.update({ where: { userId }, data: dto });
    } catch (err) {
      this.rethrowUniqueViolation(err);
      throw err;
    }
  }

  async remove(userId: string) {
    await this.findMyCompany(userId);
    await this.prisma.company.delete({ where: { userId } });
    return { message: 'Company deleted successfully' };
  }

  private rethrowUniqueViolation(err: unknown): void {
    if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === 'P2002') {
      throw new ConflictException('A company with these details already exists');
    }
  }
}
