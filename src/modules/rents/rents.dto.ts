// create-rent.dto.ts
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Prisma } from '@prisma/client';
import { Type } from 'class-transformer';
import {
  IsNotEmpty,
  IsInt,
  IsOptional,
  IsDate,
  ValidateNested,
  IsObject,
} from 'class-validator';
import { GetListDto } from 'src/common/dto/get-list';

export class CreateUpdateRentDto {
  @IsNotEmpty()
  @IsInt()
  user_id: number;

  @IsNotEmpty()
  @IsInt()
  stock_id: number;

  @IsOptional()
  @IsInt()
  custom_id?: number;
}
type ClassImplementation<T> = {
  [K in keyof T]: T[K];
};

export class DateTimeNullableFilter
  implements ClassImplementation<Prisma.DateTimeNullableFilter>
{
  @ApiProperty()
  @IsDate()
  gte: string;

  @ApiProperty()
  @IsDate()
  lte: string;
}

export class RentFilter implements ClassImplementation<Prisma.rentWhereInput> {
  @ApiPropertyOptional({ type: () => DateTimeNullableFilter })
  @ValidateNested()
  @Type(() => DateTimeNullableFilter)
  @IsObject()
  @IsOptional()
  returned_at?: DateTimeNullableFilter;
}

export class GetListRentDto extends GetListDto {
  @ApiPropertyOptional({ type: () => RentFilter })
  @ValidateNested()
  @Type(() => RentFilter)
  @IsObject()
  @IsOptional()
  filter: RentFilter;
}
