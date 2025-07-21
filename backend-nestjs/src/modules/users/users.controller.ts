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
  Put,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { JwtAuthGuard } from '@/auths/passport/jwt-auth.guard';
import { AuthsService } from '@/auths/auths.service';
import { Throttle } from '@nestjs/throttler';
import { AuthenticatedRequest } from '@/auths/auths.controller';

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

  @Put('avatar')
  @UseGuards(JwtAuthGuard)
  @Throttle({ default: { limit: 1, ttl: 60 * 1000 } })
  @UseInterceptors(FileInterceptor('file'))
  async setAvatar(
    @Req() req: AuthenticatedRequest,
    @UploadedFile() file: Express.Multer.File,
  ) {
    const userId = req.user.id;
    return this.usersService.setAvatar(userId, file);
  }

  @Get(':id')
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
