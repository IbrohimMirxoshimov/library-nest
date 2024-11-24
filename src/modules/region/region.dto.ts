import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Prisma } from '@prisma/client';
import { IsEnum, IsInt, IsOptional, IsString } from 'class-validator';
import { ApplyNestedOptional } from 'src/common/class-validators/ApplyNested';
import { IsPrismaIntFilter } from 'src/common/class-validators/IsPrismaIntFilter';
import { FindAllDto } from 'src/common/dto/find-all.dto';
import { ApiEnum } from 'src/utils/swagger/ApiEnum';
import { ApiPrismaIntFilter } from 'src/utils/swagger/ApiPrismaIntFilter';
import { ClassImplementation } from 'src/utils/type.utils';

export class CreateRegionDto
  implements ClassImplementation<Prisma.regionUncheckedCreateInput>
{
  @ApiProperty()
  @IsString()
  name: string;

  @ApiPropertyOptional()
  @IsInt()
  @IsOptional()
  parent_id?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  code?: string;
}

export class UpdateRegionDto extends CreateRegionDto {}

class RegionFilterDto implements ClassImplementation<Prisma.regionWhereInput> {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional()
  @IsInt()
  @IsOptional()
  parent_id?: number;

  @ApiPrismaIntFilter()
  @IsOptional()
  @IsPrismaIntFilter()
  id?: number | Prisma.IntFilter<'region'> | undefined;
}

export class FindAllRegionDto extends FindAllDto {
  @ApplyNestedOptional(RegionFilterDto)
  filter?: RegionFilterDto;

  @ApiEnum(Prisma.RegionScalarFieldEnum, {
    type: String,
  })
  @IsEnum(Prisma.RegionScalarFieldEnum)
  @IsOptional()
  order_by?: Prisma.RegionScalarFieldEnum;
}
