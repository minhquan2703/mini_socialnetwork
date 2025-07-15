import { Module } from '@nestjs/common';
import { UploadsService } from './uploads.service';
import { UploadsController } from './uploads.controller';
import { MulterModule } from '@nestjs/platform-express';
import multer from 'multer';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CloudinaryService } from '@/commons/services/cloudinary.service';
import { Upload } from './entities/upload.entity';

@Module({
  imports: [
    ConfigModule,
    TypeOrmModule.forFeature([Upload]),
    MulterModule.register({
      storage: multer.memoryStorage(),
      limits: {
        fileSize: 10 * 1024 * 1024, // 10MB
      },
      fileFilter: (req, file, cb) => {
        if (file.mimetype.match(/\/(jpg|jpeg|png|gif|mp4|mov|avi|webm)$/)) {
          cb(null, true);
        } else {
          cb(new Error('Only image and video files are allowed!'), false);
        }
      },
    }),
  ],
  controllers: [UploadsController],
  providers: [UploadsService, CloudinaryService],
  exports: [UploadsService, CloudinaryService],
})
export class UploadsModule {}
