import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PermissionGuard } from './common/guards/permission.guard';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './modules/auth/auth.module';
import { RentsModule } from './modules/rents/rents.module';
import { JwtAuthGuard } from './common/guards/jwt-auth.guard';
import { AuthorsModule } from './modules/authors/authors.module';
import { UserModule } from './modules/user/user.module';
import { CustomerModule } from './modules/customer/customer.module';
import { PublicApiModule } from './modules/public-apis/public-api.module';
import { StatisticsModule } from './modules/statistics/statistics.module';
import { RegionModule } from './modules/region/region.module';
import { BookModule } from './modules/book/book.module';
import { LocationModule } from './modules/location/location.module';
import { PublishingModule } from './modules/publishing/publishing.module';
import { RoleModule } from './modules/role/role.module';
import { SmsModule } from './modules/sms/sms.module';
import { StockModule } from './modules/stock/stock.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    PrismaModule,
    AuthModule,
    RentsModule,
    AuthorsModule,
    UserModule,
    CustomerModule,
    PublicApiModule,
    StatisticsModule,
    RegionModule,
    BookModule,
    LocationModule,
    PublishingModule,
    RoleModule,
    SmsModule,
    StockModule,
  ],
  controllers: [AppController],
  providers: [
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: PermissionGuard,
    },
    AppService,
  ],
})
export class AppModule {}
