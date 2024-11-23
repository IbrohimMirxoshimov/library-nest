import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsInt, IsOptional } from 'class-validator';
import { transformToNumber } from 'src/utils/transformers';

/**
 * Bu DTO ishlatilgan joylar odatda swaggerga chiqmaydi
 * location_id guard orqali qo'yiladi
 */
export class LocationIdDto {
  @IsInt()
  location_id: number;
}

export class LocationIdDtoOptional {
  @ApiPropertyOptional()
  @IsInt()
  @IsOptional()
  location_id?: number;
}

/**
 * Id va location_id required
 */
export class FindOneWithLiDto extends LocationIdDto {
  @ApiProperty()
  @Transform(transformToNumber)
  @IsInt()
  id: number;
}

/**
 * Id va location_id
 */
export class FindOneLiDto extends LocationIdDtoOptional {
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
