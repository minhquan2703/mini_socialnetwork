import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Upload } from './entities/upload.entity';
import { Repository } from 'typeorm';
import { CloudinaryService } from '@/commons/services/cloudinary.service';

@Injectable()
export class UploadsService {
  constructor(
    @InjectRepository(Upload)
    private uploadRepository: Repository<Upload>,
    private cloudinaryService: CloudinaryService,
  ) {}

  async uploadSingle(
    file: Express.Multer.File,
    userId: string,
  ): Promise<Upload> {
    const cloudinaryResult = await this.cloudinaryService.uploadFile(
      file,
      'posts',
    );

    const upload = this.uploadRepository.create({
      url: cloudinaryResult.secure_url,
      publicId: cloudinaryResult.public_id,
      type: cloudinaryResult.resource_type,
      user: { id: userId },
    });

    return this.uploadRepository.save(upload);
  }

  async uploadMultiplePost(files: Express.Multer.File[], userId: string) {
    const uploads: Upload[] = [];

    if (files.length > 9) {
      throw new BadRequestException('Maximum is 9 images');
    }
    for (const file of files) {
      const cloudinaryResult = await this.cloudinaryService.uploadFile(
        file,
        'posts',
      );

      const upload: Upload = this.uploadRepository.create({
        url: cloudinaryResult.secure_url,
        publicId: cloudinaryResult.public_id,
        type: cloudinaryResult.resource_type,
        user: { id: userId },
      });
      uploads.push(upload);
    }

    return this.uploadRepository.save(uploads);
  }

  async deleteUpload(uploadId: string): Promise<void> {
    const upload = await this.uploadRepository.findOne({
      where: { id: uploadId },
    });

    if (upload) {
      //xóa file khỏi Cloudinary
      await this.cloudinaryService.deleteFile(upload.publicId);

      //xóa record khỏi database
      await this.uploadRepository.remove(upload);
    }
  }

  async findByPostId(postId: string): Promise<Upload[]> {
    return this.uploadRepository.find({
      where: { post: { id: postId } },
      order: { createdAt: 'ASC' },
    });
  }
}
