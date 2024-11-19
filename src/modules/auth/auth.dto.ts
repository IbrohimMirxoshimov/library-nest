// src/modules/auth/auth.dto.ts

import {
  IsNotEmpty,
  IsString,
  MinLength,
  IsPhoneNumber,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { IsUzbPhoneNumber } from 'src/common/class-validators/IsUzbPhoneNumber';

export class LoginDto {
  @ApiProperty({ example: '998001112233', description: 'User phone number' })
  @IsUzbPhoneNumber()
  phone: string;

  @ApiProperty({ example: 'test11', description: 'User password' })
  @IsString()
  @MinLength(6)
  password: string;
}

export class RegisterDto {
  @IsString()
  @IsNotEmpty()
  first_name: string;

  @IsPhoneNumber()
  @IsNotEmpty()
  phone: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  password: string;

  @IsNotEmpty()
  role_id: number;
}
