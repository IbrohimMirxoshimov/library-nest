import { Injectable } from '@nestjs/common';
import { subDays } from 'date-fns';
import { PrismaService } from 'src/prisma/prisma.service';
import { GetRentCountsDto, GetTopReadingBooksDto } from './statistics.dto';
import { LocationIdDto } from 'src/common/dto/common.dto';

@Injectable()
export class StatisticsService {
  constructor(private readonly prisma: PrismaService) {}

  async getTopReadingBooks(dto: GetTopReadingBooksDto) {
    return this.prisma.$queryRaw`
      SELECT SUM(s.count::int) as count, b.name, b.id
      FROM (
        SELECT st.book_id, COUNT(r.id) as count
        FROM rents r
        LEFT JOIN stocks st ON r.stock_id = st.id
        WHERE r.rejected = false 
          AND st.location_id = ${dto.location_id}
          AND r.created_at BETWEEN ${dto.from} AND ${dto.until || new Date()}
        GROUP BY st.book_id
      ) s
      LEFT JOIN books b ON s.book_id = b.id
      GROUP BY b.id
      ORDER BY count DESC
      LIMIT ${dto.size};
    `;
  }

  async getRentCounts(dto: GetRentCountsDto) {
    return this.prisma.rent.count({
      where: {
        rejected: false, // Only rents that are not rejected
        created_at: {
          gte: dto.from,
          lte: dto.untill,
        },
        deleted_at: {
          not: null,
        },
        location_id: dto.location_id,
      },
    });
  }

  async getTopReaders(filter: {
    from?: Date;
    until?: Date;
    select?: string[];
    size?: number;
  }) {
    const { from, until, select, size } = filter;
    const fields = [
      ...(select || []),
      'users.last_name',
      'COUNT(rents.id)',
      'users.id AS user_id',
    ];

    return this.prisma.$queryRaw`
      SELECT ${fields.join(', ')}
      FROM users
      JOIN rents ON users.id = rents.customer_id
      WHERE rents.rejected = false 
        AND rents.returned_at BETWEEN ${from || new Date(2020)} AND ${until || new Date()}
        AND rents.deleted_at IS NULL
      GROUP BY users.id
      ORDER BY COUNT(rents.id) DESC
      LIMIT ${size || 10};
    `;
  }

  async getGender(location_id: number) {
    return await this.prisma.user.groupBy({
      by: ['gender'],
      where: {
        phone: {
          not: null,
        },
        gender: {
          not: null,
        },
        registered_locations: {
          has: location_id,
        },
      },
      _count: {
        id: true,
      },
    });
  }

  async getOverAllStats(dto: LocationIdDto) {
    const location_id = dto.location_id;
    // Top librarians
    const topLibrarians = await this.getTopReaders({ size: 30 });

    // Librarians count
    const librariansCount = await this.prisma.user.count({
      where: {
        phone: {
          not: null,
        },
      },
    });

    // Books count
    const booksCount = await this.prisma.$queryRaw`
      SELECT COUNT(s.id) AS count
      FROM stocks s
      WHERE s.location_id = ${location_id} AND s.deleted_at IS NULL;
    `;

    // Rents count
    const rentsCount = await this.getRentCounts({
      location_id,
      from: new Date(2021, 1, 1),
      untill: subDays(new Date(), 30),
    });

    // Reading books count
    const readingBooksCount = await this.prisma.$queryRaw`
      SELECT COUNT(r.id) AS count
      FROM rents r
      WHERE r.returned_at IS NULL AND r.deleted_at IS NULL AND r.rejected = false;
    `;

    // Expired leases
    const expiredLeases = await this.prisma.$queryRaw`
      SELECT COUNT(r.id) AS count
      FROM rents r
      LEFT JOIN stocks st ON st.id = r.stock_id
      WHERE r.deleted_at IS NULL
        AND st.location_id = ${location_id}
        AND r.returned_at IS NULL
        AND r.rejected = false
        AND r.returning_date < NOW();
    `;

    // Average daily leasing books of the last month
    const dailyLeasingBooksAverageCountOfLastMonth = await this.prisma
      .$queryRaw`
      SELECT COUNT(r.id) / 26 AS count
      FROM rents r
      WHERE r.deleted_at IS NULL
        AND r.created_at BETWEEN ${subDays(new Date(), 30)} AND NOW();
    `;

    // Leased books count (last month)
    const leasedBooksCountOfLastMonth = await this.prisma.$queryRaw`
      SELECT COUNT(r.id) AS count
      FROM rents r
      WHERE r.deleted_at IS NULL
        AND r.created_at BETWEEN ${subDays(new Date(), 30)} AND NOW();
    `;

    // Leased books count (last week)
    const leasedBooksCountOfLastWeek = await this.prisma.$queryRaw`
      SELECT COUNT(r.id) AS count
      FROM rents r
      WHERE r.deleted_at IS NULL
        AND r.created_at BETWEEN ${subDays(new Date(), 7)} AND NOW();
    `;

    // Leased books count (last 24 hours)
    const leasedBooksCountOfLast24Hours = await this.prisma.$queryRaw`
      SELECT COUNT(r.id) AS count
      FROM rents r
      WHERE r.deleted_at IS NULL
        AND r.created_at BETWEEN ${subDays(new Date(), 1)} AND NOW();
    `;

    // Top books
    const topBooks = await this.getTopReadingBooks({
      location_id: location_id,
      size: 100,
      from: new Date(2021, 3, 10),
    });

    // Top books last week
    const topBooksLastWeek = await this.getTopReadingBooks({
      location_id: location_id,
      size: 30,
      from: subDays(new Date(), 7),
    });

    // Leased rents by day (last month)
    const oneMonthLeasedRentsByDay = await this.prisma.rent.groupBy({
      by: ['created_at'],
      where: {
        created_at: {
          gte: subDays(new Date(), 30),
          lte: new Date(),
        },
      },
      _count: {
        id: true,
      },
      orderBy: {
        created_at: 'asc',
      },
    });

    // Returned rents by day (last month)
    const oneMonthReturnedRentsByDay = await this.prisma.rent.groupBy({
      by: ['returned_at'],
      where: {
        returned_at: {
          gte: subDays(new Date(), 30),
          lte: new Date(),
        },
      },
      _count: {
        id: true,
      },
      orderBy: {
        returned_at: 'asc',
      },
    });

    // Few books
    const fewBooks = await this.getFewBooks(location_id);

    return {
      top_librarians: topLibrarians,
      gender: await this.getGender(location_id),
      reading_books_count: readingBooksCount,
      librarians_count: librariansCount,
      books_count: booksCount,
      top_books: topBooks,
      rents_count: rentsCount,
      expired_leases: expiredLeases,
      daily_leasing_books_average_count_of_last_month:
        dailyLeasingBooksAverageCountOfLastMonth,
      leased_books_count_of_last_month: leasedBooksCountOfLastMonth,
      leased_books_count_of_last_week: leasedBooksCountOfLastWeek,
      leased_books_count_of_last_24_hours: leasedBooksCountOfLast24Hours,
      one_month_leased_rents_by_day: oneMonthLeasedRentsByDay,
      one_month_returned_rents_by_day: oneMonthReturnedRentsByDay,
      top_books_last_week: topBooksLastWeek,
      few_books: fewBooks,
    };
  }

  async getFewBooks(location_id: number) {
    const books = await this.prisma.book.findMany({
      where: { few: 1 },
      select: {
        id: true,
        name: true,
        stocks: {
          where: { location_id: location_id },
        },
      },
    });

    const requiredBooks: {
      total: string;
      book_id: number;
      name: string;
      busies: number;
    }[] = await this.prisma.$queryRaw`
      SELECT COUNT(s.book_id) AS total, s.book_id, b.name, SUM(s.busy::int) AS busies
      FROM stocks s
      INNER JOIN books b ON b.id = s.book_id
      WHERE b.few != 0 
        AND (b.few = 1 OR (s.deleted_at IS NULL AND s.location_id = ${location_id}))
      GROUP BY s.book_id, b.name
      HAVING 
        COUNT(s.book_id) = SUM(s.busy::int) 
        OR (COUNT(s.book_id) > 3 AND COUNT(s.book_id) - SUM(s.busy::int) = 1)
        OR (COUNT(s.book_id) > 5 AND (COUNT(s.book_id) - SUM(s.busy::int) < 4))
      ORDER BY total DESC
      LIMIT 120;
    `;

    const ids = requiredBooks.map((b) => b.book_id);

    return [
      ...requiredBooks,
      ...books
        .filter((b) => !ids.includes(b.id))
        .map((b) => ({
          name: b.name,
          few: 1,
          total: b.stocks.length,
          busies: b.stocks.filter((s) => s.busy).length,
          book_id: b.id,
        })),
    ];
  }
}
