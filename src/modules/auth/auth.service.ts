// src/modules/auth/auth.service.ts

import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../../prisma/prisma.service';
import { LoginDto, RegisterDto } from './auth.dto';
import { JwtPayload } from './auth.interface';
import { user } from '@prisma/client';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async login(dto: LoginDto) {
    const user = await this.prisma.user.findFirst({
      where: { phone: dto.phone, deleted_at: null },
      include: { role: true },
    });

    if (!user || !user.password) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await bcrypt.compare(dto.password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    return this.generateJwt(user);
  }

  generateJwt(user: user) {
    const payload: JwtPayload = { sub: user.id };

    return {
      access_token: this.jwtService.sign(payload),
      user: user,
    };
  }

  async register(dto: RegisterDto) {
    const existingUser = await this.prisma.user.findFirst({
      where: { phone: dto.phone },
    });

    if (existingUser) {
      throw new BadRequestException('Phone number already registered');
    }

    const role = await this.prisma.role.findUnique({
      where: { id: dto.role_id },
    });

    if (!role) {
      throw new BadRequestException('Invalid role');
    }

    const hashedPassword = await bcrypt.hash(dto.password, 10);

    const user = await this.prisma.user.create({
      data: {
        first_name: dto.first_name,
        phone: dto.phone,
        password: hashedPassword,
        role_id: dto.role_id,
        status: 1,
      },
      include: { role: true },
    });

    return this.generateJwt(user);
  }
}
