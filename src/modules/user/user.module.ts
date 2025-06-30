import { Module } from '@nestjs/common';
import { UserService } from '@/modules/user/user.service';
import { UserController } from '@/modules/user/user.controller';

@Module({
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule {}
