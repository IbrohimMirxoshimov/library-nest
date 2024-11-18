import { BadRequestException, Injectable } from '@nestjs/common';
import { rent } from '@prisma/client';
import { ResponseItems } from 'src/common/decorators/swagger.decorators';
import { GetOneLiDto } from 'src/common/dto/common.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { ReqUser } from '../auth/auth.interface';
import { CreateRentDto, GetListRentDto, UpdateRentDto } from './rents.dto';

@Injectable()
export class RentsService {
  constructor(private prisma: PrismaService) {}

  async create(createRentDto: CreateRentDto, currentUser: ReqUser) {
    const current_user_location = currentUser.locationId;

    if (!current_user_location) {
      throw new BadRequestException('User must be location');
    }

    // Check if stock exists and belongs to user's location
    const stock = await this.prisma.stock.findFirst({
      where: {
        id: createRentDto.stock_id,
        location_id: current_user_location,
        deleted_at: null,
      },
      include: {
        book: {
          select: {
            rent_duration: true,
            few: true,
          },
        },
      },
    });

    if (!stock) {
      throw new BadRequestException('Stock not found in your library');
    }

    // Check if stock is available
    if (stock.busy) {
      throw new BadRequestException('This book is already rented');
    }

    // Check if user exists and can rent
    const user = await this.prisma.user.findFirst({
      where: {
        id: createRentDto.user_id,
        deleted_at: null,
        status: 1, // assuming 1 is active status
      },
    });

    if (!user) {
      throw new BadRequestException('User not found or inactive');
    }

    // TODO
    // Check if user has active rents
    // const activeRents = await this.prisma.rent.count({
    //   where: {
    //     user_id: createRentDto.user_id,
    //     returned_at: null,
    //     rejected: false,
    //     deleted_at: null,
    //   },
    // });

    // Get total available books of this type
    // const totalAvailableBooks = await this.prisma.stock.count({
    //   where: {
    //     book_id: stock.book_id,
    //     location_id: current_user_location,
    //     busy: false,
    //     deleted_at: null,
    //   },
    // });

    // Check if we can rent out another copy based on 'few' setting
    // if (totalAvailableBooks <= stock.book.few) {
    //   throw new BadRequestException(
    //     'Cannot rent this book - minimum stock level reached',
    //   );
    // }

    // Calculate returning date based on book's rent duration
    const rentDuration = stock.book.rent_duration || 15; // default to 15 if not set
    const returningDate = new Date();
    returningDate.setDate(returningDate.getDate() + rentDuration);

    try {
      // Use transaction to ensure data consistency
      return await this.prisma.$transaction(async (tx) => {
        // Create rent record
        const rent = await tx.rent.create({
          data: {
            user_id: createRentDto.user_id,
            stock_id: stock.id,
            location_id: current_user_location,
            leased_at: new Date(),
            returning_date: returningDate,
            custom_id: createRentDto.custom_id,
          },
          include: {
            user: {
              select: {
                first_name: true,
                last_name: true,
                phone: true,
              },
            },
            stock: {
              include: {
                book: {
                  select: {
                    name: true,
                    author: {
                      select: {
                        name: true,
                      },
                    },
                  },
                },
              },
            },
          },
        });

        // Update stock status to busy
        await tx.stock.update({
          where: { id: stock.id },
          data: { busy: true },
        });

        // Create log entry
        await tx.log.create({
          data: {
            path: '/rents',
            method: 'POST',
            resourse: 'rent',
            resourse_id: rent.id,
            user_id: currentUser.id,
            data: rent,
          },
        });

        return rent;
      });
    } catch (error) {
      throw new BadRequestException(
        'Failed to create rent record: ' + error.message,
      );
    }
  }

  async findOne(dto: GetOneLiDto) {
    return this.prisma.rent.findFirst({
      where: dto,
    });
  }

  async update(dto: UpdateRentDto) {
    await this.prisma.rent.update({
      where: { id: dto.id, location_id: dto.location_id },
      data: {},
    });

    return this.findOne(dto);
  }

  // TODO
  // shablonlashtirish kerak
  // paginatsiyalarni bitta funksiyaga ajratib qo'yish kerak
  async findAll(dto: GetListRentDto): Promise<ResponseItems<rent>> {
    const [total, rents] = await Promise.all([
      this.prisma.rent.count({ where: dto.filter }),
      this.prisma.rent.findMany({
        where: dto.filter,
        include: {
          stock: true,
        },
        orderBy: { [dto.order_by || 'updated_at']: dto.order },
        skip: (dto.page - 1) * dto.limit,
        take: dto.limit,
      }),
    ]);

    return {
      total,
      items: rents,
      page: dto.page,
    };
  }
}
