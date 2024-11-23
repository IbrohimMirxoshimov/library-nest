import { BadRequestException, Injectable } from '@nestjs/common';
import { book } from '@prisma/client';
import { FindOneLiDto } from 'src/common/dto/common.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import {
  getPaginationOptions,
  getPaginationResponse,
} from 'src/utils/pagination.utils';
import { ICrudService } from '../../common/interfaces/crud.interface';
import { CreateBookDto, FindAllBookDto, UpdateBookDto } from './book.dto';

@Injectable()
export class BookService implements ICrudService<book> {
  constructor(private prisma: PrismaService) {}

  async findOne(dto: FindOneLiDto) {
    return this.prisma.book.findFirst({
      where: dto,
    });
  }

  async update(find_dto: FindOneLiDto, dto: UpdateBookDto) {
    await this.prisma.book.update({
      where: find_dto,
      data: { ...dto, searchable_name: await this.createSearchableName(dto) },
    });

    return this.findOne(find_dto);
  }

  async remove(find_dto: FindOneLiDto) {
    await this.prisma.book.update({
      where: find_dto,
      data: {
        deleted_at: new Date(),
      },
    });
  }

  async findAll(dto: FindAllBookDto) {
    const pagination = await getPaginationResponse({
      items: this.prisma.book.findMany({
        where: dto.filter,
        ...getPaginationOptions(dto),
      }),
      count: this.prisma.book.count({ where: dto.filter }),
      dto,
    });

    return pagination;
  }

  async createSearchableName(book: { name: string; author_id: number }) {
    const author = await this.prisma.author.findFirst({
      where: { id: book.author_id },
    });

    // TODO add publisher name
    // add collections names

    if (!author) {
      throw new BadRequestException('Author not found');
    }

    // TODO krildan lotinga o'giriadigan funksiya chaqirish kerak
    // va faqat ingliz alifbosi qoladigan funskiya ham
    return `${book.name}_${author.name}`.toLocaleLowerCase();
  }

  async create(dto: CreateBookDto) {
    return this.prisma.book.create({
      data: {
        ...dto,
        searchable_name: await this.createSearchableName(dto),
      },
    });
  }
}
