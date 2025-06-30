import { Module } from '@nestjs/common';
import { AuthorsController } from '@/modules/authors/authors.controller';
import { AuthorsService } from '@/modules/authors/authors.service';

@Module({
  controllers: [AuthorsController],
  providers: [AuthorsService],
})
export class AuthorsModule {}
