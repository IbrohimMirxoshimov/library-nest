// create-rent.dto.ts
import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { Prisma } from '@prisma/client';
import { Type } from 'class-transformer';
import {
  IsDate,
  IsEnum,
  IsInt,
  IsObject,
  IsOptional,
  ValidateNested,
} from 'class-validator';
import { DateTimeRangeDto, LocationIdDto } from 'src/common/dto/common.dto';
import { GetListDto } from 'src/common/dto/get-list.dto';
import { ApiEnum } from 'src/utils/swagger/ApiEnum';
import { ClassImplementation } from 'src/utils/type.utils';

export class CreateRentDto
  extends LocationIdDto
  implements ClassImplementation<Prisma.rentCreateInput>
{
  @ApiProperty()
  @IsInt()
  user_id: number;

  @ApiProperty()
  @IsInt()
  stock_id: number;

  @ApiProperty()
  @IsDate()
  returning_date: string;

  @ApiPropertyOptional()
  leased_at?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsInt()
  custom_id?: number;
}

export class UpdateRentDto extends PartialType(CreateRentDto) {
  @ApiProperty()
  @IsInt()
  id: number;
}

class RentFilterDto
  extends LocationIdDto
  implements ClassImplementation<Prisma.rentWhereInput>
{
  @ApiPropertyOptional({ type: () => DateTimeRangeDto })
  @ValidateNested()
  @Type(() => DateTimeRangeDto)
  @IsObject()
  @IsOptional()
  returned_at?: DateTimeRangeDto;
}

export class GetListRentDto extends GetListDto {
  @ApiPropertyOptional({ type: () => RentFilterDto })
  @ValidateNested()
  @Type(() => RentFilterDto)
  @IsObject()
  @IsOptional()
  filter: RentFilterDto;

  @ApiEnum(Prisma.RentScalarFieldEnum, {
    type: String,
  })
  @IsEnum(Prisma.RentScalarFieldEnum)
  @IsOptional()
  order_by?: Prisma.RentScalarFieldEnum;
}
