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
import { Permissions } from '@/common/constants/constants.permissions';
import { RequirePermissions } from '@/common/decorators/permissions.decorators';
import { FindOneLiDto } from '@/common/dto/common.dto';
import {
  CreateBookDto,
  FindAllBookDto,
  UpdateBookDto,
} from '@/modules/book/book.dto';
import { BookService } from '@/modules/book/book.service';
import { throwErrorIfNotFound } from '@/utils/response.utils';

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
