import * as multer from 'multer';
import * as path from 'node:path';

export const fileDiskStorage = multer.diskStorage({
  destination: './uploads',
  filename(
    _,
    file: Express.Multer.File,
    cb: (error: Error | null, filename: string) => void,
  ) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const extension = path.extname(file.originalname);
    cb(null, file.fieldname + '-' + uniqueSuffix + extension);
  },
});
