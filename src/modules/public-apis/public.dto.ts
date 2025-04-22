import { ApiProperty, ApiPropertyOptional,  } from "@nestjs/swagger";
import { Prisma } from "@prisma/client";
import { Transform } from "class-transformer";
import { IsInt, IsNotEmpty, IsOptional, IsString } from "class-validator";
import { ApplyNestedOptional } from "src/common/class-validators/ApplyNested";
import { IsPrismaIntFilter } from "src/common/class-validators/IsPrismaIntFilter";
import { LocationIdDtoOptional } from "src/common/dto/common.dto";
import { FindAllDto } from "src/common/dto/find-all.dto";
import { ApiPrismaIntFilter } from "src/utils/swagger/ApiPrismaIntFilter";
import { transformToNumber } from "src/utils/transformers";

export class BookFilterPublicDto  {
    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    name?: string;

    @ApiPrismaIntFilter()
    @IsOptional()
    @IsPrismaIntFilter()
    id?: number | Prisma.IntFilter<'book'> | undefined;
}

export class FindAllBookPublicDto extends FindAllDto {
    @ApplyNestedOptional(BookFilterPublicDto)
    filter?: BookFilterPublicDto;

    @ApiProperty({ isArray: true, type: Number, required: true })
    location_id: number[];

    @ApiProperty()
    @ApiPropertyOptional()
    busy?: boolean;

    @ApiProperty()
    @ApiPropertyOptional()
    search?: string;
}

export class FindOneBookPublicDto extends LocationIdDtoOptional {
    @ApiProperty()
    @Transform(transformToNumber)
    @IsInt()
    id: number;
}

export class StaticsFilterDto {}

export class FindAllPublicStats extends FindAllDto {
    @ApiProperty()
    filter: StaticsFilterDto;

    @ApiProperty({isArray: true, type: Number})
    location_id: number[];

    @ApiProperty()
    book_id: number;
}

export class ExpiredRentFilterDto {
    @ApiProperty()
    id?: number;

    @ApiProperty()
    gender?: string;
}

export class ExpiredRentDto extends FindAllDto{
    @ApiProperty()
    filter?: ExpiredRentFilterDto;

    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    phone: string;
}