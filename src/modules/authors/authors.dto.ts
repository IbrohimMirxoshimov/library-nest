import { Prisma } from '@prisma/client';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEnum,
  IsObject,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { SearchableField } from '@/common/class-validators/SearchableField';
import { FindAllDto } from '@/common/dto/find-all.dto';
import { ApiEnum } from '@/utils/swagger/ApiEnum';
import { ClassImplementation } from '@/utils/type.utils';

export class CreateAuthorDto
  implements ClassImplementation<Prisma.authorCreateInput>
{
  @ApiProperty()
  @IsString()
  name: string;
}

export class UpdateAuthorDto extends CreateAuthorDto {}

class AuthorFilterDto implements ClassImplementation<Prisma.authorWhereInput> {
  @SearchableField()
  @IsOptional()
  name?: string;
}

export class GetListAuthorDto extends FindAllDto {
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
