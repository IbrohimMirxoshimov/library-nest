import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Prisma } from '@prisma/client';
import { IsEnum, IsNumber, IsOptional, IsString } from 'class-validator';
import { ApplyNestedOptional } from 'src/common/class-validators/ApplyNested';
import { FindAllDto } from 'src/common/dto/find-all.dto';
import { ApiEnum } from 'src/utils/swagger/ApiEnum';
import { ClassImplementation } from 'src/utils/type.utils';

export class UploadFileDto {
  @ApiProperty({
    type: 'string',
    format: 'binary',
    description: 'The file to upload.',
  })
  file: Express.Multer.File & { [key: string]: any };

  @ApiPropertyOptional({
    default: 0,
    description: 'The sequence order of the file among multiple uploads',
  })
  sort: number;
}

export class CreateFileDto
  implements ClassImplementation<Prisma.fileCreateInput>
{
  @IsString()
  name: string;

  @IsNumber()
  size: number;

  @IsNumber()
  sort: number;
}

export class FileFindOneDto {
  @ApiProperty()
  @IsString()
  id: string;
}

class FileFilterDto implements ClassImplementation<Prisma.fileWhereInput> {}

export class FindAllFileDto extends FindAllDto {
  @ApplyNestedOptional(FileFilterDto)
  filter?: FileFilterDto;

  @ApiEnum(Prisma.FileScalarFieldEnum, {
    type: String,
  })
  @IsEnum(Prisma.FileScalarFieldEnum)
  @IsOptional()
  order_by?: Prisma.FileScalarFieldEnum;
}
