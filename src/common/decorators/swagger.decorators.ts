import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class ResponseItems<T extends Object = any> {
  @ApiProperty({ type: Object, isArray: true })
  items: T[];

  @ApiProperty({
    default: 10,
  })
  page: number;

  @ApiProperty({
    default: 1,
  })
  total: number;

  @ApiPropertyOptional()
  message?: string;
}
