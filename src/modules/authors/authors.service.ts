import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import {
  CreateAuthorDto,
  GetListAuthorDto,
  UpdateAuthorDto,
} from './authors.dto';
import { ReqUser } from '../auth/auth.interface';
import { ResponseItems } from '../../common/decorators/swagger.decorators';
import { author } from '@prisma/client';
import { GetOneDto } from '../../common/dto/common.dto';

@Injectable()
export class AuthorsService {
  constructor(private prisma: PrismaService) {}

  async create(createAuthorDto: CreateAuthorDto, currentUser: ReqUser) {
    try {
      return await this.prisma.$transaction(async (tx) => {
        const author = await tx.author.create({
          data: {
            name: createAuthorDto.name,
            creator_id: currentUser.id,
          },
        });
        await tx.log.create({
          data: {
            path: '/authors',
            method: 'POST',
            resourse: 'author',
            resourse_id: author.id,
            user_id: currentUser.id,
            data: author,
          },
        });
        return author;
      });
    } catch (error) {
      throw new BadRequestException(
        'Failed to create author: ' + error.message,
      );
    }
  }

  async findOne(dto: GetOneDto) {
    return this.prisma.author.findFirst({
      where: dto,
    });
  }

  async update(dto: UpdateAuthorDto) {
    await this.prisma.author.update({
      where: { id: dto.id },
      data: dto,
    });

    return await this.findOne(dto);
  }

  async remove(id: number) {
    await this.prisma.author.delete({
      where: { id },
    });
    return { id };
  }

  async findAll(dto: GetListAuthorDto): Promise<ResponseItems<author>> {
    const [total, authors] = await Promise.all([
      this.prisma.author.count({ where: dto.filter }),
      this.prisma.author.findMany({
        where: dto.filter,
        orderBy: { [dto.order_by || 'updated_at']: dto.order },
        skip: (dto.page - 1) * dto.limit,
        take: dto.limit,
      }),
    ]);

    return {
      total,
      items: authors,
      page: dto.page,
    };
  }
}
