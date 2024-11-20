import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Prisma } from '@prisma/client';
import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { ApplyNestedOptional } from 'src/common/class-validators/ApplyNested';
import { IsPrismaIntFilter } from 'src/common/class-validators/IsPrismaIntFilter';
import { FindAllDto } from 'src/common/dto/find-all.dto';
import { ApiEnum } from 'src/utils/swagger/ApiEnum';
import { ApiPrismaIntFilter } from 'src/utils/swagger/ApiPrismaIntFilter';
import { ClassImplementation } from 'src/utils/type.utils';

export class CreatePublishingDto
  implements ClassImplementation<Prisma.publishingCreateInput>
{
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  name: string;
}

export class UpdatePublishingDto extends CreatePublishingDto {}

class PublishingFilterDto
  implements ClassImplementation<Prisma.publishingWhereInput>
{
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPrismaIntFilter()
  @IsOptional()
  @IsPrismaIntFilter()
  id?: number | Prisma.IntFilter<'publishing'> | undefined;
}

export class FindAllPublishingDto extends FindAllDto {
  @ApplyNestedOptional(PublishingFilterDto)
  filter?: PublishingFilterDto;

  @ApiEnum(Prisma.PublishingScalarFieldEnum, {
    type: String,
  })
  @IsEnum(Prisma.PublishingScalarFieldEnum)
  @IsOptional()
  order_by?: Prisma.PublishingScalarFieldEnum;
}
