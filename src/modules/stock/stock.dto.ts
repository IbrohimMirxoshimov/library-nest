import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Prisma } from '@prisma/client';
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

  @ApiProperty()
  @IsInt()
  source: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  busy?: boolean;
}

export class UpdateStockDto extends CreateStockDto {}

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
