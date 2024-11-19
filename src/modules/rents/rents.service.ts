import { BadRequestException, Injectable } from '@nestjs/common';
import { rent } from '@prisma/client';
import { FindOneLiDto } from 'src/common/dto/common.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import {
  getPaginationOptions,
  getPaginationResponse,
} from 'src/utils/pagination.utils';
import { ICrudService } from '../../common/interfaces/crud.interface';
import { ReqUser } from '../auth/auth.interface';
import { CreateRentDto, FindAllRentDto, UpdateRentDto } from './rents.dto';

@Injectable()
export class RentsService implements ICrudService<rent> {
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
        await tx.rent.create({
          data: {
            user_id: createRentDto.user_id,
            stock_id: stock.id,
            location_id: current_user_location,
            leased_at: new Date(),
            returning_date: returningDate,
            custom_id: createRentDto.custom_id,
          },
        });

        // Update stock status to busy
        await tx.stock.update({
          where: { id: stock.id },
          data: { busy: true },
        });
      });
    } catch (error) {
      throw new BadRequestException(
        'Failed to create rent record: ' + error.message,
      );
    }
  }

  async findOne(dto: FindOneLiDto) {
    return this.prisma.rent.findFirst({
      where: dto,
    });
  }

  async update(find_dto: FindOneLiDto, dto: UpdateRentDto) {
    await this.prisma.rent.update({
      where: find_dto,
      data: dto,
    });

    return this.findOne(dto);
  }

  async remove(find_dto: FindOneLiDto) {
    await this.prisma.rent.update({
      where: find_dto,
      data: {
        deleted_at: new Date(),
      },
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
