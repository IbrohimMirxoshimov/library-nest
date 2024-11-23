import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Prisma, StockSource, StockStatus } from '@prisma/client';
import {
  IsBoolean,
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
} from 'class-validator';
import { ApplyNestedOptional } from 'src/common/class-validators/ApplyNested';
import { IsPrismaIntFilter } from 'src/common/class-validators/IsPrismaIntFilter';
import { LocationIdDto } from 'src/common/dto/common.dto';
import { FindAllDto } from 'src/common/dto/find-all.dto';
import { ApiEnum } from 'src/utils/swagger/ApiEnum';
import { ApiPrismaIntFilter } from 'src/utils/swagger/ApiPrismaIntFilter';
import { ClassImplementation } from 'src/utils/type.utils';

export class CreateStockDto
  extends LocationIdDto
  implements ClassImplementation<Prisma.stockCreateInput>
{
  @ApiProperty()
  @IsInt()
  book_id: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsInt()
  price?: number;

  @ApiEnum(StockSource)
  @IsOptional()
  @IsEnum(StockSource)
  source?: StockSource;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  busy?: boolean;

  @ApiEnum(StockStatus)
  @IsOptional()
  @IsEnum(StockStatus)
  status?: StockStatus;
}

export class UpdateStockDto
  extends LocationIdDto
  implements ClassImplementation<Prisma.stockUpdateInput>
{
  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsEnum(StockStatus)
  status?: StockStatus;

  @IsOptional()
  @IsInt()
  price?: number;

  @ApiEnum(StockSource)
  @IsOptional()
  @IsEnum(StockSource)
  source?: StockSource;
}

class StockFilterDto
  extends LocationIdDto
  implements ClassImplementation<Prisma.stockWhereInput>
{
  @ApiPrismaIntFilter()
  @IsOptional()
  @IsPrismaIntFilter()
  id?: number | Prisma.IntFilter<'stock'>;

  @ApiPrismaIntFilter()
  @IsOptional()
  @IsPrismaIntFilter()
  book_id?: number | Prisma.IntFilter<'stock'>;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  busy?: boolean;
}

export class FindAllStockDto extends FindAllDto {
  @ApplyNestedOptional(StockFilterDto)
  filter?: StockFilterDto;

  @ApiEnum(Prisma.StockScalarFieldEnum, {
    type: String,
  })
  @IsEnum(Prisma.StockScalarFieldEnum)
  @IsOptional()
  order_by?: Prisma.StockScalarFieldEnum;
}
