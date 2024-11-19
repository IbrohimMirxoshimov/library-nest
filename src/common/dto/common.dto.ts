import { ApiProperty } from '@nestjs/swagger';
import { Prisma } from '@prisma/client';
import { Transform } from 'class-transformer';
import { IsInt, IsISO8601, IsOptional } from 'class-validator';
import { transformToNumber } from 'src/utils/transformers';
import { ClassImplementation } from 'src/utils/type.utils';

/**
 * Bu DTO ishlatilgan joylar odatda swaggerga chiqmaydi
 * location_id guard orqali qo'yiladi
 * location bo'lmasligi ham mumkin
 */
export class LocationIdDto {
  @IsInt()
  @IsOptional()
  location_id?: number;
}

/**
 * Id va location_id
 */
export class FindOneLiDto extends LocationIdDto {
  @ApiProperty()
  @Transform(transformToNumber)
  @IsInt()
  id: number;
}

export class FindOneDto {
  @ApiProperty()
  @Transform(transformToNumber)
  @IsInt()
  id: number;
}

export class DateTimeRangeDto
  implements ClassImplementation<Prisma.DateTimeNullableFilter>
{
  @ApiProperty({
    example: new Date().toISOString(),
  })
  @IsISO8601()
  gte: string;

  @ApiProperty({
    example: new Date().toISOString(),
  })
  @IsISO8601()
  lte: string;
}
