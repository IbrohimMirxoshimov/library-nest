import { Body, Controller, Get, Param, Post, Query } from "@nestjs/common";
import { Public } from "src/common/decorators/public.decorator";
import { PublicApiService } from "./public-api.service";
import { FindAllBookPublicDto, FindOneBookPublicDto } from "./public.dto";

@Controller('public')
export class PublicApiController {
    constructor(private readonly publicApiService: PublicApiService) {}

    @Public()
    @Post('books')
    getAllBooks(@Body() dto: FindAllBookPublicDto) {
        return this.publicApiService.getAllBooks(dto)
    }

    @Public()
    @Get(":id")
    getOneBook(@Param() dto: FindOneBookPublicDto) {
        return this.publicApiService.getOne(dto);
    }

    @Public()
    @Get('/returning-date')
    returningDate() {
    }

    @Public()
    @Post('/statistics')
    getAllStatistics() {
        return this.publicApiService.getStatistics();
    }

    @Public()
    @Post("/get-list")
    getByPhoneNumber() {
        return this.publicApiService.getDataByPhoneNumber();
    }
}