import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Prisma } from '@prisma/client';
import {
  IsBoolean,
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

export class CreateLocationDto
  implements ClassImplementation<Prisma.locationCreateInput>
{
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty()
  @IsInt()
  region_id: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  link?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  active?: boolean;

  // TODO address qo'shish kerak
}

export class UpdateLocationDto extends CreateLocationDto {}

class LocationFilterDto
  implements ClassImplementation<Prisma.locationWhereInput>
{
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPrismaIntFilter()
  @IsOptional()
  @IsPrismaIntFilter()
  id?: number | Prisma.IntFilter<'location'> | undefined;

  @ApiPrismaIntFilter()
  @IsOptional()
  @IsPrismaIntFilter()
  region_id?: number | Prisma.IntFilter<'location'> | undefined;
}

export class FindAllLocationDto extends FindAllDto {
  @ApplyNestedOptional(LocationFilterDto)
  filter?: LocationFilterDto;

  @ApiEnum(Prisma.LocationScalarFieldEnum, {
    type: String,
  })
  @IsEnum(Prisma.LocationScalarFieldEnum)
  @IsOptional()
  order_by?: Prisma.LocationScalarFieldEnum;
}
