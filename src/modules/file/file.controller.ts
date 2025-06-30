import {
  Body,
  Controller,
  Delete,
  ForbiddenException,
  Get,
  NotFoundException,
  Param,
  Post,
  Res,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { ApiBearerAuth, ApiConsumes } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { Response } from 'express';
import { Permissions } from '@/common/constants/constants.permissions';
import { RequirePermissions } from '@/common/decorators/permissions.decorators';
import { Public } from '@/common/decorators/public.decorator';
import { FileService } from '@/modules/file/file.service';
import { FileWithBodyInterceptor } from '@/modules/file/file-with-body.interceptor';
import {
  FileFindOneDto,
  FindAllFileDto,
  UploadFileDto,
} from '@/modules/file/file.dto';
import { throwErrorIfNotFound } from '@/utils/response.utils';

@Controller('files')
export class FileController {
  constructor(private readonly fileService: FileService) {}

  @RequirePermissions(Permissions.FILE_CREATE)
  @Post()
  @ApiBearerAuth()
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileWithBodyInterceptor)
  @UseInterceptors(FileInterceptor('file'))
  create(
    @Body() _: UploadFileDto,
    @UploadedFile() file: Express.Multer.File & { [key: string]: any },
  ) {
    const fileData = {
      size: file.size,
      sort: parseInt(file.sort, 10),
      name: file.filename,
      public: file.public === 'true' || file.public === true,
    };
    return this.fileService.create(fileData);
  }

  @RequirePermissions(Permissions.FILE_READ)
  @Post('get-list')
  @ApiBearerAuth()
  findAll(@Body() dto: FindAllFileDto) {
    return this.fileService.findAll(dto);
  }

  @RequirePermissions(Permissions.FILE_READ)
  @Get('/:id')
  @ApiBearerAuth()
  findOne(@Param() dto: FileFindOneDto) {
    return this.fileService.findOne(dto).then(throwErrorIfNotFound);
  }

  @RequirePermissions(Permissions.FILE_READ)
  @Get('/:id/secure-raw')
  @ApiBearerAuth()
  async getRaw(@Param() dto: FileFindOneDto, @Res() res: Response) {
    const file = await this.fileService.findOne(dto);
    if (!file) {
      throw new NotFoundException();
    }
    const stream = await this.fileService.getFileStream(file.name);
    stream.pipe(res);
  }

  @Public()
  @Get('/:id/public-raw')
  async getPublicRaw(@Param() dto: FileFindOneDto, @Res() res: Response) {
    const file = await this.fileService.findOne(dto);
    if (!file) {
      throw new NotFoundException();
    }
    if (!file.public) {
      throw new ForbiddenException('File is not public');
    }
    const stream = await this.fileService.getFileStream(file.name);
    stream.pipe(res);
  }

  @RequirePermissions(Permissions.FILE_DELETE)
  @Delete('/:id')
  @ApiBearerAuth()
  remove(@Param() find_dto: FileFindOneDto) {
    return this.fileService.remove(find_dto);
  }
}
