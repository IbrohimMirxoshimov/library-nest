import { ApiProperty } from '@nestjs/swagger';
import { Prisma } from '@prisma/client';
import { IsInt, IsISO8601, IsOptional } from 'class-validator';
import { ClassImplementation } from 'src/utils/type.utils';

/**
 * DTO ishlatilgan joylar odatda swaggerga chiqmaydi
 * location_id guard orqali qo'yiladi
 * location bo'lmasligi ham mumkin
 */

export class LocationIdDto {
  @IsInt()
  @IsOptional()
  location_id?: number;
}
/**
 * Id uchun
 * Location Id ham qo'shilgani
 */

export class GetOneLiDto extends LocationIdDto {
  @ApiProperty()
  @IsInt()
  id: number;
}

export class GetOneDto {
  @ApiProperty()
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
