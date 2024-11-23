import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Prisma } from '@prisma/client';
import {
	IsEnum,
	IsInt,
	IsISO8601,
	IsOptional,
	IsString
} from 'class-validator';
import { ApplyNestedOptional } from 'src/common/class-validators/ApplyNested';
import { IsPrismaIntFilter } from 'src/common/class-validators/IsPrismaIntFilter';
import { FindAllDto } from 'src/common/dto/find-all.dto';
import { ApiEnum } from 'src/utils/swagger/ApiEnum';
import { ApiPrismaIntFilter } from 'src/utils/swagger/ApiPrismaIntFilter';
import { ClassImplementation } from 'src/utils/type.utils';

export class CreateBookDto
  implements ClassImplementation<Prisma.bookCreateInput>
{
  @ApiProperty()
  @IsString()
  name: string;

  @ApiProperty()
  @IsString()
  searchable_name: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  image?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsInt()
  rent_duration?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsISO8601()
  printed_at?: Date;

  @ApiPropertyOptional()
  @IsOptional()
  @IsInt()
  pages?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsInt()
  sort?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsInt()
  author_id?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsInt()
  books_group_id?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsInt()
  collection_id?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  isbn?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsInt()
  few?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  language?: string;
}

export class UpdateBookDto extends CreateBookDto {}

class BookFilterDto implements ClassImplementation<Prisma.bookWhereInput> {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPrismaIntFilter()
  @IsOptional()
  @IsPrismaIntFilter()
  id?: number | Prisma.IntFilter<'book'> | undefined;
}

export class FindAllBookDto extends FindAllDto {
  @ApplyNestedOptional(BookFilterDto)
  filter?: BookFilterDto;

  @ApiEnum(Prisma.BookScalarFieldEnum, {
    type: String,
  })
  @IsEnum(Prisma.BookScalarFieldEnum)
  @IsOptional()
  order_by?: Prisma.BookScalarFieldEnum;
}