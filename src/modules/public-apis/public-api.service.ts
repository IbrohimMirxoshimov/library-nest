import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma.service';
import {
  FindAllBookPublicDto,
  FindAllPublicStats,
  FindOneBookPublicDto,
} from '@/modules/public-apis/public.dto';
import { getPaginationResponse } from '@/utils/pagination.utils';

@Injectable()
export class PublicApiService {
  constructor(private prisma: PrismaService) {}

  async getAllBooks(dto: FindAllBookPublicDto) {
    return getPaginationResponse({
      items: this.prisma.book.findMany({
        where: {
          stocks: {
            some: {
              location_id: {
                in: dto.location_id || [1],
              },
              busy: dto.busy,
            },
          },
        },
        select: {
          id: true,
          name: true,
          images: true,
          description: true,
          updated_at: true,
          stocks: {
            select: {
              id: true,
              busy: true,
              location_id: true,
            },
          },
          author: {
            select: {
              name: true,
            },
          },
        },
      }),
      count: this.prisma.book.count({ where: dto.filter }),
      dto,
    });
  }

  async getOne(dto: FindOneBookPublicDto) {
    return this.prisma.book.findUnique({
      where: { id: dto.id },
      select: {
        id: true,
        name: true,
        images: true,
        description: true,
        updated_at: true,
        stocks: {
          select: {
            id: true,
            busy: true,
            location_id: true,
          },
        },
        author: {
          select: {
            name: true,
          },
        },
        collection: {
          select: {
            name: true,
          },
        },
      },
    });
  }

  async getBookStatuses(dto: FindAllPublicStats) {
    return getPaginationResponse({
      items: this.prisma.rent.findMany({
        where: {
          returned_at: null,
          rejected: false,
          deleted_at: null,
          stock: {
            location_id: {
              in: dto.location_id || [1],
            },
            book_id: dto.book_id,
          },
        },
        select: {
          id: true,
          returned_at: true,
          stock: {
            select: {
              location_id: true,
              book_id: true,
            },
          },
        },
      }),
      count: this.prisma.rent.count({ where: dto.filter }),
      dto,
    });
  }

  getDataByPhoneNumber() {}

  getStatistics() {}
}
