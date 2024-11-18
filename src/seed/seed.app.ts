import { NestFactory } from '@nestjs/core';
import { AppModule } from 'src/app.module';
import { Permissions } from 'src/common/constants/constants.permissions';
import { AuthService } from 'src/modules/auth/auth.service';
import { PrismaService } from '../prisma/prisma.service';

const seedMain = async () => {
  const app = await NestFactory.create(AppModule);

  const authSerice = await app.get(AuthService);
  const prisma = await app.get(PrismaService);

  const role = await prisma.role.upsert({
    create: {
      id: 1,
      name: 'Super Admin',
      permissions: Object.values(Permissions),
    },
    update: {
      permissions: Object.values(Permissions),
    },
    where: {
      id: 1,
    },
  });
  const user = await prisma.user.findFirst({ where: { id: 1 } });

  if (!user) {
    await authSerice.register({
      first_name: 'Admin',
      password: 'test11',
      phone: '998001112233',
      role_id: role.id,
    });
  }

  console.log('SEEDER FINISHED');

  await app.close();
};

void seedMain();
