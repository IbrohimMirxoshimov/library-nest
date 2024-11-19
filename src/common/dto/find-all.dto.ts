import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsEnum, IsInt, IsOptional } from 'class-validator';
import { ApiEnum } from 'src/utils/swagger/ApiEnum';
import { transformToNumber } from 'src/utils/transformers';

export enum SqlOrderEnum {
  ASC = 'asc',
  DESC = 'desc',
}

export class FindAllDto {
  @ApiPropertyOptional({ default: 10, maximum: 100 })
  @Transform(transformToNumber)
  @IsInt()
  @IsOptional()
  public limit: number = 100;

  @ApiPropertyOptional({
    default: 1,
  })
  @Transform(({ value }) => parseInt(value))
  @IsInt()
  @IsOptional()
  public page: number = 1;

  @ApiEnum(SqlOrderEnum, {
    type: String,
  })
  @IsEnum(SqlOrderEnum)
  @IsOptional()
  public order: SqlOrderEnum = SqlOrderEnum.DESC;

  @ApiPropertyOptional()
  @IsOptional()
  order_by?: string;

  filter?: unknown;
}
