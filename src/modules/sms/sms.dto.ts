import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Prisma } from '@prisma/client';
import {
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';
import { ApplyNestedOptional } from 'src/common/class-validators/ApplyNested';
import { IsPrismaIntFilter } from 'src/common/class-validators/IsPrismaIntFilter';
import { FindAllDto } from 'src/common/dto/find-all.dto';
import { ApiEnum } from 'src/utils/swagger/ApiEnum';
import { ApiPrismaIntFilter } from 'src/utils/swagger/ApiPrismaIntFilter';
import { ClassImplementation } from 'src/utils/type.utils';

export class CreateSmsDto
  implements ClassImplementation<Prisma.smsCreateInput>
{
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  phone: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  text?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsInt()
  status?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsInt()
  user_id?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsInt()
  sms_bulk_id?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsInt()
  provider?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  provider_message_id?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  error_reason?: string;
}

export class UpdateSmsDto extends CreateSmsDto {}

class SmsFilterDto implements ClassImplementation<Prisma.smsWhereInput> {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiPrismaIntFilter()
  @IsOptional()
  @IsPrismaIntFilter()
  id?: number | Prisma.IntFilter<'sms'> | undefined;
}

export class FindAllSmsDto extends FindAllDto {
  @ApplyNestedOptional(SmsFilterDto)
  filter?: SmsFilterDto;

  @ApiEnum(Prisma.SmsScalarFieldEnum, {
    type: String,
  })
  @IsEnum(Prisma.SmsScalarFieldEnum)
  @IsOptional()
  order_by?: Prisma.SmsScalarFieldEnum;
}
