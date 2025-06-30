import { Module } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';
import { FileService } from '@/modules/file/file.service';
import { FileController } from '@/modules/file/file.controller';
import { fileDiskStorage } from '@/modules/file/file-disk-storage';

@Module({
  imports: [
    MulterModule.register({
      storage: fileDiskStorage,
      limits: {
        fileSize: 1024 * 1024 * 100,
      },
    }),
  ],
  controllers: [FileController],
  providers: [FileService],
})
export class FileModule {}
