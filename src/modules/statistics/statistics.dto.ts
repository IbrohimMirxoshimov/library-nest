import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { getDateAfterYear } from 'src/utils/date.util';

export class GetTopReadingBooksDto {
  @ApiProperty({ default: 1 })
  location_id: number;

  @ApiProperty({ default: 10 })
  size: number;

  @ApiProperty({ default: getDateAfterYear() })
  from: Date;

  @ApiPropertyOptional({ default: new Date() })
  until?: Date;
}

export class GetRentCountsDto {
  @ApiProperty({ default: 1 })
  location_id: number;

  @ApiProperty({ default: getDateAfterYear() })
  from: Date;

  @ApiProperty({ default: new Date() })
  untill: Date;
}
