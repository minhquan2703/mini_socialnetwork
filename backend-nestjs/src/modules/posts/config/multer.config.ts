import { diskStorage } from 'multer';
import { v4 as uuidv4 } from 'uuid';
import { extname } from 'path';
import { BadRequestException } from '@nestjs/common';

export class MulterConfigService {
  static getConfig() {
    return {
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, callback) => {
          const uniqueId = uuidv4();
          const ext = extname(file.originalname);
          const prefix = file.fieldname === 'video' ? 'video' : 'image';
          callback(null, `${prefix}-${uniqueId}${ext}`);
        },
      }),
      // eslint-disable-next-line @typescript-eslint/unbound-method
      fileFilter: this.mixedFileFilter,
      limits: {
        fileSize: 100 * 1024 * 1024, // 100MB
        files: 10, //maximum 10 images/1 video
      },
    };
  }

  private static imageFilter(
    req: any,
    file: Express.Multer.File,
    callback: any,
  ) {
    const allowedImageTypes = /\/(jpg|jpeg|png|gif|webp)$/;
    if (!file.mimetype.match(allowedImageTypes)) {
      callback(
        new BadRequestException(
          'Chỉ được upload ảnh (jpg, jpeg, png, gif, webp)',
        ),
        false,
      );
    } else {
      callback(null, true);
    }
  }

  private static videoFilter(
    req: any,
    file: Express.Multer.File,
    callback: any,
  ) {
    const allowedVideoTypes = /\/(mp4|avi|mov|wmv|flv|mkv)$/;
    if (!file.mimetype.match(allowedVideoTypes)) {
      callback(
        new BadRequestException(
          'Chỉ được upload video (mp4, avi, mov, wmv, flv, mkv)',
        ),
        false,
      );
    } else {
      callback(null, true);
    }
  }

  private static mixedFileFilter(
    req: any,
    file: Express.Multer.File,
    callback: any,
  ) {
    if (file.fieldname === 'images') {
      MulterConfigService.imageFilter(req, file, callback);
    } else if (file.fieldname === 'video') {
      MulterConfigService.videoFilter(req, file, callback);
    } else {
      callback(new BadRequestException('Field không hợp lệ'), false);
    }
  }
}

// ===== FILE VALIDATION SERVICE =====
export class FileValidationService {
  static validateImages(files: Express.Multer.File[]) {
    if (!files || files.length === 0) {
      throw new BadRequestException('Không có file ảnh nào được upload');
    }

    if (files.length > 10) {
      throw new BadRequestException('Tối đa 10 ảnh mỗi post');
    }

    const maxImageSize = 10 * 1024 * 1024; // 10MB
    const allowedTypes = [
      'image/jpeg',
      'image/jpg',
      'image/png',
      'image/gif',
      'image/webp',
    ];

    files.forEach((file, index) => {
      if (file.size > maxImageSize) {
        throw new BadRequestException(
          `Ảnh ${index + 1} vượt quá kích thước cho phép (10MB)`,
        );
      }

      if (!allowedTypes.includes(file.mimetype)) {
        throw new BadRequestException(
          `File ${index + 1} không phải là ảnh hợp lệ`,
        );
      }
    });

    return files;
  }

  static validateVideo(file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException('Không có file video nào được upload');
    }

    const maxVideoSize = 100 * 1024 * 1024; // 100MB
    const allowedTypes = [
      'video/mp4',
      'video/avi',
      'video/mov',
      'video/wmv',
      'video/flv',
      'video/mkv',
    ];

    if (file.size > maxVideoSize) {
      throw new BadRequestException(
        'Video vượt quá kích thước cho phép (100MB)',
      );
    }

    if (!allowedTypes.includes(file.mimetype)) {
      throw new BadRequestException('File không phải là video hợp lệ');
    }

    return file;
  }
}
