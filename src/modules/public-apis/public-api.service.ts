import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { getPaginationResponse } from "src/utils/pagination.utils";
import { ExpiredRentDto, FindAllBookPublicDto, FindAllPublicStats, FindOneBookPublicDto } from "./public.dto";

@Injectable()
export class PublicApiService {
    constructor(private prisma: PrismaService) {}

    async getAllBooks(dto: FindAllBookPublicDto) {
      return getPaginationResponse({
        items: this.prisma.book.findMany({
          where: {
            AND: [
              {
                stocks: {
                  some: {
                    location_id: {
                      in: dto.location_id || [1]
                    },
                    busy: dto.busy,
                  }
                },
              },
              dto.search ? {
                name: {
                  contains: dto.search,
                  mode: 'insensitive',
                }
              } : {},
            ]
          },
          select: {
            id: true,
            name: true,
            image: true,
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
      })
    }

    async getOne(dto: FindOneBookPublicDto) {
      const res = await this.prisma.book.findUnique({
        where: { id: dto.id },
        select: {
          id: true,
          name: true,
          image: true,
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
      if (!res) {
        throw new NotFoundException('Book not found');
      }
      return res;
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
                in: dto.location_id || [1]
              },
              book_id: dto.book_id
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
      })
    }

    async getExpiredRentsByPhone(dto: ExpiredRentDto) {
      const threeDaysBack = new Date();
      threeDaysBack.setDate(threeDaysBack.getDate() - 3);
  
      return getPaginationResponse({
        items: this.prisma.rent.findMany({
          where: {
            customer: {
              phone: dto.phone,
            },
            rejected: false,
            returned_at: {
              lt: threeDaysBack,
            },
          },
          include: {
            stock: {
              include: {
                book: true,
              },
            },
            customer: true,
          },
          orderBy: {
            returned_at: 'asc',
          },
        }),
        count: this.prisma.rent.count({ where: dto.filter }),
        dto
      });
    }
}
