import { NestFactory } from '@nestjs/core';
import { PrismaModule } from 'src/prisma/prisma.module';
import { MigrationOldDataService } from './service';
import { PrismaService } from 'src/prisma/prisma.service';

const seedOldDb = async () => {
  const app = await NestFactory.create(PrismaModule);

  const prisma = await app.get(PrismaService);

  const ms = new MigrationOldDataService(prisma);

  await ms.migrateAll();

  await app.close();
};

void seedOldDb();
