import { ClassImplementation } from '../../utils/type.utils';
import { Prisma } from '@prisma/client';
import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import {
  IsEnum,
  IsInt,
  IsNotEmptyObject,
  IsObject,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { GetListDto } from '../../common/dto/get-list.dto';
import { Transform, Type } from 'class-transformer';
import { ApiEnum } from '../../utils/swagger/ApiEnum';

export class CreateAuthorDto
  implements ClassImplementation<Prisma.authorCreateInput>
{
  @ApiProperty()
  @IsString()
  name: string;
}

export class UpdateAuthorDto extends PartialType(CreateAuthorDto) {
  @ApiProperty()
  @IsInt()
  id: number;
}

class AuthorFilterDto implements ClassImplementation<Prisma.authorWhereInput> {
  @ApiPropertyOptional({
    title: 'Name of the author',
    description:
      'Search will be performed, records are selected if they contain given input',
    type: String,
  })
  @Transform(({ value }) => {
    // validate initial input type manually
    if (!value || typeof value !== 'string') return {};
    return {
      contains: value,
      mode: 'insensitive',
    };
  })
  // empty object is received after transformation if initial type was invalid
  @IsNotEmptyObject({}, { message: 'name must be a string' })
  @IsOptional()
  name?: string;
}

export class GetListAuthorDto extends GetListDto {
  @ApiPropertyOptional({ type: () => AuthorFilterDto })
  @ValidateNested()
  @Type(() => AuthorFilterDto)
  @IsObject()
  @IsOptional()
  filter: AuthorFilterDto;

  @ApiEnum(Prisma.AuthorScalarFieldEnum, {
    type: String,
  })
  @IsEnum(Prisma.AuthorScalarFieldEnum)
  @IsOptional()
  order_by?: Prisma.AuthorScalarFieldEnum;
}
