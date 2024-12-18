// create-rent.dto.ts
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Prisma } from '@prisma/client';
import {
  IsEnum,
  IsInt,
  IsISO8601,
  IsOptional,
  IsString,
} from 'class-validator';
import {
  DateTimeRangeDto,
  IsDateTimeRange,
} from 'src/common/class-validators/IsDateTimeRange';
import { IsPrismaIntFilter } from 'src/common/class-validators/IsPrismaIntFilter';
import { LocationIdDto } from 'src/common/dto/common.dto';
import { FindAllDto } from 'src/common/dto/find-all.dto';
import { ApiEnum } from 'src/utils/swagger/ApiEnum';
import { ApiPrismaIntFilter } from 'src/utils/swagger/ApiPrismaIntFilter';
import { ClassImplementation } from 'src/utils/type.utils';
import { ApplyNestedOptional } from '../../common/class-validators/ApplyNested';

export class CreateRentDto
  extends LocationIdDto
  implements ClassImplementation<Prisma.rentCreateInput>
{
  @ApiProperty()
  @IsInt()
  customer_id: number;

  @ApiProperty()
  @IsInt()
  stock_id: number;

  @ApiProperty({ example: new Date().toISOString() })
  @IsISO8601()
  due_date: string;

  @ApiProperty({ example: new Date().toISOString() })
  @IsISO8601()
  rented_at: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsInt()
  custom_id?: number;
}

export class CreateCommentToRentDto
  implements ClassImplementation<Prisma.commentUncheckedCreateInput>
{
  @ApiProperty()
  @IsString()
  text: string;
}

export class UpdateRentDto
  extends LocationIdDto
  implements ClassImplementation<Prisma.rentUpdateInput>
{
  @ApiPropertyOptional({ example: new Date().toISOString() })
  @IsISO8601()
  @IsOptional()
  due_date?: string;

  @ApiPropertyOptional({ example: new Date().toISOString() })
  @IsISO8601()
  @IsOptional()
  rented_at?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsInt()
  custom_id?: number;
}

class RentFilterDto
  extends LocationIdDto
  implements ClassImplementation<Prisma.rentWhereInput>
{
  @IsDateTimeRange()
  returned_at?: DateTimeRangeDto;

  @ApiPrismaIntFilter()
  @IsOptional()
  @IsPrismaIntFilter()
  id?: number | Prisma.IntFilter<'rent'> | undefined;
}

export class FindAllRentDto extends FindAllDto {
  @ApplyNestedOptional(RentFilterDto)
  filter?: RentFilterDto;

  @ApiEnum(Prisma.RentScalarFieldEnum, {
    type: String,
  })
  @IsEnum(Prisma.RentScalarFieldEnum)
  @IsOptional()
  order_by?: Prisma.RentScalarFieldEnum;
}
