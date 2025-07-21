import { forwardRef, Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { AuthsModule } from '@/auths/auths.module';
import { UploadsService } from '../uploads/uploads.service';
import { Upload } from '../uploads/entities/upload.entity';
import { CloudinaryService } from '@/commons/services/cloudinary.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Upload]),
    forwardRef(() => AuthsModule),
  ],
  controllers: [UsersController],
  providers: [UsersService, UploadsService, CloudinaryService],
  exports: [UsersService],
})
export class UsersModule {}
