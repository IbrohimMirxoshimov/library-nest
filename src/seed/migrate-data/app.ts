import { NestFactory } from '@nestjs/core';
import { PrismaModule } from '@/prisma/prisma.module';
import { PrismaService } from '@/prisma/prisma.service';
import { MigrationOldDataService } from '@/seed/migrate-data/service';

const seedOldDb = async () => {
  const app = await NestFactory.create(PrismaModule);

  const prisma = await app.get(PrismaService);

  const ms = new MigrationOldDataService(prisma);

  await ms.migrateAll();

  await app.close();
};

void seedOldDb();
