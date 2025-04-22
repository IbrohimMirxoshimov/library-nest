import { Body, Controller, Get, Param, Post, Query } from "@nestjs/common";
import { Public } from "src/common/decorators/public.decorator";
import { PublicApiService } from "./public-api.service";
import { ExpiredRentDto, FindAllBookPublicDto, FindAllPublicStats, FindOneBookPublicDto } from "./public.dto";

@Controller('public')
export class PublicApiController {
    constructor(private readonly publicApiService: PublicApiService) {}

    @Public()
    @Post('books')
    getAllBooks(@Body() dto: FindAllBookPublicDto) {
        return this.publicApiService.getAllBooks(dto)
    }

    @Public()
    @Get("books/:id")
    getOneBook(@Param() dto: FindOneBookPublicDto) {
        return this.publicApiService.getOne(dto);
    }

    @Public()
    @Post('/expired-rent-info')
    returningDate(@Body() dto: ExpiredRentDto) {
        return this.publicApiService.getExpiredRentsByPhone(dto);
    }

    @Public()
    @Post(':id/statistics')
    getAllStatistics(@Body() dto: FindAllPublicStats) {
        return this.publicApiService.getBookStatuses(dto);
    }
}