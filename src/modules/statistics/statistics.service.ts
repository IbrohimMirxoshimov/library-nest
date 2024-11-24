import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { GetRentCountsDto, GetTopReadingBooksDto } from "./statistics.dto";

@Injectable()
export class StatisticsService {
    constructor(private readonly prisma: PrismaService) {}

    async getTopReadingBooks(dto: GetTopReadingBooksDto) {
        const result = await this.prisma.rent.groupBy({
            by: ['stock_id'],
            _count: {
              id: true,
            },
            where: {
              rejected: false,
              stock: {
                location_id: dto.location_id,
              },
              created_at: {
                gte: dto.from,
                lte: dto.until,
              },
            },
            orderBy: {
              _count: {
                id: 'desc',
              },
            },
            take: dto.size,
          });
        
          const bookDetails = await Promise.all(
            result.map(async (rent) => {
              const stock = await this.prisma.stock.findUnique({
                where: { id: rent.stock_id },
                include: {
                  book: true,
                },
              });
              return {
                count: rent._count.id,
                name: stock?.book.name,
                id: stock?.book.id,
              };
            })
          );   

        return bookDetails;
    }

    async getRentCounts(dto: GetRentCountsDto) {
        return this.prisma.rent.count({
            where: {
              rejected: false, // Only rents that are not rejected
              created_at: {
                gte: dto.fromDate,
                lte: dto.untillDate,
              },
              stock: {
                location_id: dto.location_id,
              },
            },
        });
    }
}