import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseInterceptors,
  UploadedFile,
  Req,
  UseGuards,
  Inject,
  forwardRef,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { JwtAuthGuard } from '@/auths/passport/jwt-auth.guard';
import { AuthsService } from '@/auths/auths.service';
import { Throttle } from '@nestjs/throttler';

@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    @Inject(forwardRef(() => AuthsService))
    private readonly authService: AuthsService,
  ) {}

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Get()
  async findAll(
    @Query() query: string,
    @Query('current') current: string,
    @Query('pageSize') pageSize: string,
  ) {
    return this.usersService.findAll(query, +current, +pageSize);
  }

  // @Post('upload-image')
  // @UseGuards(JwtAuthGuard)
  // @UseInterceptors(
  //   FileInterceptor('file', {
  //     storage: diskStorage({
  //       destination: './uploads',
  //       filename: (req, file, callback) => {
  //         const name = Date.now() + extname(file.originalname);
  //         callback(null, name);
  //       },
  //     }),
  //   }),
  // )
  // async uploadImage(
  //   @Req() req, 
  //   @UploadedFile() file: Express.Multer.File,
  // ) {
  //   const userId = req.user.id; 
  //   const imageUrl = `/uploads/${file.filename}`;
  //   return this.usersService.updateImage(userId, imageUrl);
  // }

  @Post('upload-avatar')
  @UseGuards(JwtAuthGuard)
  @Throttle({ default: { limit: 1, ttl: 60000 } })
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, callback) => {
          const name = Date.now() + extname(file.originalname);
          callback(null, name);
        },
      }),
    }),
  )
  async uploadAvatar(@Req() req, @UploadedFile() file: Express.Multer.File) {
    const userId = req.user.id; 
    const imageUrl = `/uploads/${file.filename}`;
    return this.authService.uploadAvatar(userId, imageUrl);
  }

  @Get(':id')
  @Throttle({ default: { limit: 10, ttl: 3000 } })
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }

  @Patch()
  update(@Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(id);
  }
}
