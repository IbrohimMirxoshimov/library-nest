import { Module } from '@nestjs/common';
import { FileService } from './file.service';
import { FileController } from './file.controller';
import { MulterModule } from '@nestjs/platform-express';
import { fileDiskStorage } from './file-disk-storage';

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
