import { Module } from '@nestjs/common';
import { PhotosService } from './photos.service';
import { PhotosController } from './photos.controller';

@Module({
  imports: [],
  controllers: [PhotosController],
  providers: [PhotosService],
})
export class PhotosModule {}
