import { Module } from '@nestjs/common';
import { BookService } from '@/modules/book/book.service';
import { BookController } from '@/modules/book/book.controller';

@Module({
  controllers: [BookController],
  providers: [BookService],
})
export class BookModule {}
