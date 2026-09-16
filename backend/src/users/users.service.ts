import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { PrismaService } from '../database/prisma.service';

@Injectable()
export class UsersService {
  constructor(
    private readonly prisma: PrismaService,
  ) {}

  async createUser(data: {
    supabaseId: string;
    email: string;
    firstName: string;
    lastName: string;
  }) {
    const existingUser = await this.prisma.user.findUnique({
      where: {
        supabaseId: data.supabaseId,
      },
    });

    if (existingUser) {
      throw new ConflictException('User already exists');
    }

    return this.prisma.user.create({
      data: {
        supabaseId: data.supabaseId,
        email: data.email,
        firstName: data.firstName,
        lastName: data.lastName,
        role: 'CUSTOMER',
      },
    });
  }

  async findBySupabaseId(supabaseId: string) {
    const user = await this.prisma.user.findUnique({
      where: {
        supabaseId,
      },
      include: {
        company: true,
      },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }
}