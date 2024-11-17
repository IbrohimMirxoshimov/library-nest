// src/modules/auth/auth.dto.ts

import {
  IsNotEmpty,
  IsString,
  MinLength,
  IsPhoneNumber,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
  @ApiProperty({ example: '+998001112233', description: 'User phone number' })
  @IsString()
  @IsNotEmpty()
  phone: string;

  @ApiProperty({ example: 'test', description: 'User password' })
  @IsString()
  @IsNotEmpty()
  @MinLength(4)
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
