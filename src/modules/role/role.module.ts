import { Module } from '@nestjs/common';
import { RoleService } from '@/modules/role/role.service';
import { RoleController } from '@/modules/role/role.controller';

@Module({
  controllers: [RoleController],
  providers: [RoleService],
})
export class RoleModule {}
