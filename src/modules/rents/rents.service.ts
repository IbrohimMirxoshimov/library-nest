import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateRentDto, FindAllRentDto, UpdateRentDto } from './rents.dto';
import { getDateDifferenceInDays } from 'src/utils/date.util';
import { ReqUser } from '../auth/auth.interface';
import { FindOneLiDto, FindOneWithLiDto } from 'src/common/dto/common.dto';
import {
  getPaginationOptions,
  getPaginationResponse,
} from 'src/utils/pagination.utils';
import { UserStatus } from '@prisma/client';

@Injectable()
export class RentService {
  constructor(private prisma: PrismaService) {}

  private readonly BLOCKING_LATE_TIME_FROM_LEASED_IN_DAYS = 70;
  private readonly BLOCKING_LATE_TIME_FROM_RETURNING_IN_DAYS = 10;
  private readonly default_book_price = 50000;
  private readonly default_rent_duration_of_book_in_days = 15;

  private async isRequiredBook(bookId: number): Promise<boolean> {
    const requiredBooks = await this.getRequiredBooks();
    return requiredBooks.some((book) => book.id === bookId);
  }

  private async getRequiredBooks() {
    // Implement logic to fetch required books
    // This might come from a separate service or configuration
    throw new Error('implement');
    return this.prisma.book.findMany();
  }

  private async canGetMoreRentStrategy(stock: any, customer_id: number) {
    const activeRentsCount = await this.prisma.rent.count({
      where: {
        customer_id: customer_id,
        returned_at: null,
      },
    });

    if (activeRentsCount === 0) return;

    // Check if the book is a required book
    if (await this.isRequiredBook(stock.bookId)) {
      if (activeRentsCount < 5) return;
      throw new BadRequestException(
        'Additional book cannot be issued. Book is in required list!',
      );
    }

    // Check active rents
    const activeRents = await this.prisma.rent.findMany({
      where: {
        customer_id: customer_id,
        returned_at: null,
      },
      include: {
        stock: {
          include: {
            book: true,
          },
        },
      },
    });

    // Check for rejected rents
    if (activeRents.some((rent) => rent.rejected)) {
      throw new BadRequestException('Unreturned book exists');
    }

    // Check if any active rent is a required book
    if (
      activeRents.some(
        async (rent) => await this.isRequiredBook(rent.stock.book_id),
      )
    ) {
      if (activeRentsCount < 5) return;
      throw new BadRequestException(
        'Additional book cannot be issued. Book is in required list!',
      );
    }

    // Check total rents history
    const totalRentsCount = await this.prisma.rent.count({
      where: {
        customer_id,
      },
    });

    const leasedRents = totalRentsCount - activeRentsCount;

    const rentStrategy = [
      { minLeases: 5, maxActives: 2 },
      { minLeases: 12, maxActives: 3 },
      { minLeases: 25, maxActives: 4 },
      { minLeases: 40, maxActives: 5 },
    ];

    const strategyMatch = rentStrategy.some(
      (strategy) =>
        strategy.maxActives > activeRentsCount &&
        strategy.minLeases <= leasedRents,
    );

    if (!strategyMatch) {
      if (activeRentsCount < 5) return;
      throw new BadRequestException(
        `Cannot be issued. ${activeRentsCount} active rents exist!`,
      );
    }
  }

  async create(dto: CreateRentDto, user: ReqUser) {
    // Validate returning date
    if (dto.returning_date < dto.leased_at) {
      throw new BadRequestException('Invalid dates');
    }

    // Find stock with book details
    const stock = await this.prisma.stock.findUnique({
      where: {
        id: dto.stock_id,
        location_id: dto.location_id,
        busy: false,
      },
      include: {
        book: true,
      },
    });

    if (!stock) {
      throw new BadRequestException('Book not available or inactive');
    }

    // Validate user can rent
    await this.validateUserRent(
      dto.customer_id,
      dto.location_id,
      // todo
      // book ga qo'yish kerak price ni
      // stockda ham bo'ladi
      stock.price || this.default_book_price,
    );

    // Check rent strategy
    await this.canGetMoreRentStrategy(stock, dto.customer_id);

    // Validate rent duration
    if (stock.location_id === 1) {
      const rentDurationDays = getDateDifferenceInDays(
        new Date(dto.returning_date),
        new Date(dto.leased_at),
      );

      const rent_duration =
        stock.book.rent_duration || this.default_rent_duration_of_book_in_days;

      if (rentDurationDays >= +1) {
        throw new BadRequestException(
          `Maximum rent duration: ${rent_duration} days`,
        );
      }
    }

    // Create rent and update stock
    const rent = await this.prisma.$transaction(async (tx) => {
      await tx.stock.update({
        where: { id: stock.id },
        data: { busy: true },
      });

      return tx.rent.create({
        data: {
          customer_id: dto.customer_id,
          librarian_id: user.id,
          location_id: dto.location_id,
          leased_at: dto.leased_at,
          returning_date: dto.returning_date,
          stock_id: dto.stock_id,
        },
      });
    });

    return rent;
  }

  async return(find_dto: FindOneWithLiDto) {
    const rent = await this.prisma.rent.findUnique({
      where: {
        ...find_dto,
        returned_at: null,
      },
      include: {
        stock: true,
        customer: true,
      },
    });

    if (!rent) {
      throw new NotFoundException('Rent not found');
    }

    const now = new Date();
    let isUserBlocked = false;

    // Check blocking conditions
    if (
      getDateDifferenceInDays(now, new Date(rent.returning_date)) >
        this.BLOCKING_LATE_TIME_FROM_LEASED_IN_DAYS ||
      getDateDifferenceInDays(now, new Date(rent.returning_date)) >
        this.BLOCKING_LATE_TIME_FROM_RETURNING_IN_DAYS
    ) {
      isUserBlocked = true;
    }

    // Update rent and stock in transaction
    const result = await this.prisma.$transaction(async (tx) => {
      // Update stock availability
      await tx.stock.update({
        where: { id: rent.stock_id },
        data: {
          busy: false,
          deleted_at: null,
        },
      });

      // Update rent
      const updatedRent = await tx.rent.update({
        where: find_dto,
        data: {
          returned_at: now,
          rejected: false,
        },
      });

      // Block user if needed
      if (isUserBlocked) {
        await tx.user.update({
          where: { id: rent.customer_id },
          // TODO user status enum
          data: { status: UserStatus.BLOCKED },
        });
      }

      return { rent: updatedRent, isUserBlocked };
    });

    return result;
  }

  private async validateUserRent(
    userId: number,
    libraryId: number,
    bookPrice = 50000,
  ) {
    const user = await this.prisma.user.findUnique({
      where: {
        id: userId,
        registered_locations: { has: libraryId },
      },
    });

    if (!user) {
      throw new BadRequestException('User not found');
    }

    if (user.status === UserStatus.ACTIVE) {
      return true;
    }

    if (user.status === UserStatus.BLOCKED) {
      if (user.blocking_reason) {
        throw new BadRequestException(user.blocking_reason);
      }

      if ((user.balance || 0) >= bookPrice) {
        return true;
      }

      throw new BadRequestException(
        `Blocked. User balance must have at least ${bookPrice} som.`,
      );
    }

    throw new BadRequestException('Unexpected error');
  }

  async reject(find_dto: FindOneWithLiDto) {
    const rent = await this.prisma.rent.findUnique({
      where: find_dto,
      include: { stock: true },
    });

    if (!rent) {
      throw new NotFoundException('Rent not found');
    }

    return this.prisma.$transaction(async (tx) => {
      await tx.rent.update({
        where: find_dto,

        // TODO required  add note
        data: { rejected: true },
      });

      await tx.stock.delete({
        where: { id: rent.stock_id },
      });

      return { message: 'Rent rejected' };
    });
  }

  async cancel(find_dto: FindOneWithLiDto) {
    const rent = await this.prisma.rent.findUnique({
      where: find_dto,
      include: { stock: true },
    });

    if (!rent) {
      throw new NotFoundException('Rent not found');
    }

    return this.prisma.$transaction(async (tx) => {
      // kitob o'chirilganda bo'shatiladi

      // tekshiramiz
      // 1. avval qaytarib
      // 2. keyin u kitobni boshqasiga berib
      // 3. keyin o'chirsa -> kitobni bo'shatib qo'ymasligi uchun
      if (!rent.returned_at && rent.stock.busy) {
        await tx.stock.update({
          where: { id: rent.stock_id },
          data: { busy: false },
        });
      }

      await tx.rent.delete({
        where: { id: find_dto.id },
      });

      return { message: 'Rent deleted' };
    });
  }

  async update(find_dto: FindOneWithLiDto, dto: UpdateRentDto, user: ReqUser) {
    const rent = await this.prisma.rent.findUnique({
      where: find_dto,
    });

    if (!rent) {
      throw new NotFoundException('Rent not found');
    }

    const updatedRent = await this.prisma.$transaction(async (tx) => {
      const result = await tx.rent.update({
        where: find_dto,
        data: dto,
      });

      // Optional: Create a comment for returning date change
      if (dto.returning_date && dto.leased_at) {
        await tx.comment.create({
          data: {
            text: `Returning date changed from ${rent.returning_date.toLocaleDateString()} to ${dto.returning_date}`,
            rent_id: find_dto.id,
            user_id: user.id,
          },
        });
      }

      return result;
    });

    return updatedRent;
  }

  async findOne(dto: FindOneLiDto) {
    return this.prisma.rent.findFirst({
      where: dto,
    });
  }

  async findAll(dto: FindAllRentDto) {
    const pagination = await getPaginationResponse({
      items: this.prisma.rent.findMany({
        where: dto.filter,
        include: {
          stock: true,
        },
        ...getPaginationOptions(dto),
      }),
      count: this.prisma.rent.count({ where: dto.filter }),
      dto,
    });

    return pagination;
  }
}
