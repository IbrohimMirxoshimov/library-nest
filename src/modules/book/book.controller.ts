import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';
import { Permissions } from 'src/common/constants/constants.permissions';
import { RequirePermissions } from 'src/common/decorators/permissions.decorators';
import { FindOneLiDto } from 'src/common/dto/common.dto';
import { throwErrorIfNotFound } from 'src/utils/response.utils';
import { CreateBookDto, FindAllBookDto, UpdateBookDto } from './book.dto';
import { BookService } from './book.service';

@ApiBearerAuth()
@Controller('books')
export class BookController {
  constructor(private readonly bookService: BookService) {}

  @RequirePermissions(Permissions.BOOK_CREATE)
  @Post()
  create(@Body() dto: CreateBookDto) {
    return this.bookService.create(dto);
  }

  @RequirePermissions(Permissions.BOOK_READ)
  @Post('get-list')
  findAll(@Body() dto: FindAllBookDto) {
    return this.bookService.findAll(dto);
  }

  @RequirePermissions(Permissions.BOOK_READ)
  @Get('/:id')
  findOne(@Param() dto: FindOneLiDto) {
    return this.bookService.findOne(dto).then(throwErrorIfNotFound);
  }

  @Put('/:id')
  @RequirePermissions(Permissions.BOOK_UPDATE)
  update(@Param() find_dto: FindOneLiDto, @Body() dto: UpdateBookDto) {
    return this.bookService.update(find_dto, dto);
  }

  @Delete(':id')
  remove(@Param() find_dto: FindOneLiDto) {
    return this.bookService.remove(find_dto);
  }
}
