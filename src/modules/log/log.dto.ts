import { ApiPropertyOptional } from '@nestjs/swagger';
import { Prisma } from '@prisma/client';
import { IsEnum, IsInt, IsOptional, IsString } from 'class-validator';
import { ApplyNestedOptional } from 'src/common/class-validators/ApplyNested';
import {
  DateTimeRangeDto,
  IsDateTimeRange,
} from 'src/common/class-validators/IsDateTimeRange';
import { FindAllDto } from 'src/common/dto/find-all.dto';
import { ApiEnum } from 'src/utils/swagger/ApiEnum';
import { ClassImplementation } from 'src/utils/type.utils';

class LogFilterDto implements ClassImplementation<Prisma.logWhereInput> {
  @IsDateTimeRange()
  created_at?: DateTimeRangeDto;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  resourse?: string;

  @ApiPropertyOptional()
  @IsInt()
  @IsOptional()
  user_id?: number | Prisma.IntFilter<'log'> | undefined;
}

export class FindAllLogDto extends FindAllDto {
  @ApplyNestedOptional(LogFilterDto)
  filter?: LogFilterDto;

  @ApiEnum(Prisma.LocationScalarFieldEnum, {
    type: String,
  })
  @IsEnum(Prisma.LocationScalarFieldEnum)
  @IsOptional()
  order_by?: Prisma.LocationScalarFieldEnum;
}
