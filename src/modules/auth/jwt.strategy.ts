// src/modules/auth/jwt.strategy.ts

import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { app_config } from 'src/config/app.config';
import { PrismaService } from '../../prisma/prisma.service';
import { ReqUser, JwtPayload } from './auth.interface';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private prisma: PrismaService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: app_config.secret,
      ignoreExpiration: false,
    });
  }

  async validate(payload: JwtPayload): Promise<ReqUser> {
    console.log('payload', payload);

    const user = await this.prisma.user.findUnique({
      where: { id: payload.sub, deleted_at: null },
      include: { role: true },
    });

    if (!user || user.status !== 1 || !user.role_id) {
      throw new UnauthorizedException('User is not active');
    }

    const jwt_payload: ReqUser = {
      id: user.id,
      roleId: user.role_id,
      permissions: user.role?.permissions || [],
      locationId: user.role?.location_id || 0,
    };

    return jwt_payload;
  }
}
