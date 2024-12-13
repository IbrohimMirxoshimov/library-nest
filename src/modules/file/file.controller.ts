import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Post,
  Res,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { Response } from 'express';
import { ApiBearerAuth, ApiConsumes } from '@nestjs/swagger';
import { Permissions } from 'src/common/constants/constants.permissions';
import { RequirePermissions } from 'src/common/decorators/permissions.decorators';
import { throwErrorIfNotFound } from 'src/utils/response.utils';
import { FileFindOneDto, FindAllFileDto, UploadFileDto } from './file.dto';
import { FileService } from './file.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { FileWithBodyInterceptor } from './file-with-body.interceptor';
import * as path from 'node:path';
import { createReadStream } from 'node:fs';

@ApiBearerAuth()
@Controller('files')
export class FileController {
  constructor(private readonly fileService: FileService) {}

  @RequirePermissions(Permissions.FILE_CREATE)
  @Post()
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileWithBodyInterceptor)
  @UseInterceptors(FileInterceptor('file'))
  create(
    @Body() _: UploadFileDto,
    @UploadedFile() file: Express.Multer.File & { [key: string]: any },
  ) {
    const fileData = {
      size: file.size,
      sort: parseInt(file.sort),
      name: file.filename,
    };
    return this.fileService.create(fileData);
  }

  @RequirePermissions(Permissions.FILE_READ)
  @Post('get-list')
  findAll(@Body() dto: FindAllFileDto) {
    return this.fileService.findAll(dto);
  }

  @RequirePermissions(Permissions.FILE_READ)
  @Get('/:id')
  findOne(@Param() dto: FileFindOneDto) {
    return this.fileService.findOne(dto).then(throwErrorIfNotFound);
  }

  @RequirePermissions(Permissions.FILE_READ)
  @Get('/:id/raw')
  async getRaw(@Param() dto: FileFindOneDto, @Res() res: Response) {
    const file = await this.fileService.findOne(dto);
    if (!file) {
      throw new NotFoundException();
    }
    const filepath = path.join(process.cwd(), 'uploads', file.name);
    const stream = createReadStream(filepath);
    stream.pipe(res);
  }

  @RequirePermissions(Permissions.FILE_DELETE)
  @Delete('/:id')
  remove(@Param() find_dto: FileFindOneDto) {
    return this.fileService.remove(find_dto);
  }
}
