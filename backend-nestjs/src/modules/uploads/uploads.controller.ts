import {
  Controller,
  Delete,
  Param,
  Post,
  Req,
  UploadedFile,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { UploadsService } from './uploads.service';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { JwtAuthGuard } from '@/auths/passport/jwt-auth.guard';
import { AuthenticatedRequest } from '@/auths/auths.controller';

@Controller('uploads')
export class UploadsController {
  constructor(private readonly uploadsService: UploadsService) {}
  @Post('single')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('file'))
  async uploadSingle(
    @UploadedFile() file: Express.Multer.File,
    @Req() req: AuthenticatedRequest,
  ) {
    const result = await this.uploadsService.uploadSingle(file, req.user.id);
    return {
      message: 'File uploaded successfully',
      data: result,
    };
  }

  @Post('multiple')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FilesInterceptor('files', 10)) //Tối đa 10 files
  async uploadMultiple(
    @UploadedFiles() files: Express.Multer.File[],
    @Req() req: AuthenticatedRequest,
  ) {
    const results = await this.uploadsService.uploadMultiplePost(
      files,
      req.user.id,
    );
    return {
      message: 'Files uploaded successfully',
      data: results,
    };
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  async deleteUpload(@Param('id') id: string) {
    await this.uploadsService.deleteUpload(id);
    return {
      message: 'File deleted successfully',
    };
  }
}
