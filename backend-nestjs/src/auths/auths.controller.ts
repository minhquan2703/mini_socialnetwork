import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Request,
} from '@nestjs/common';
import { UpdateAuthDto } from './dto/update-auth.dto';
import {
  ActiveAuthDto,
  CreateAuthDto,
  VerifyAuthDto,
} from './dto/create-auth.dto';
import { Public, ResponseMessage } from './decorator/customize';
import { AuthsService } from './auths.service';
import { LocalAuthGuard } from './passport/local-auth.guard';
import { UsersService } from '@/modules/users/users.service';

@Controller('auths')
export class AuthsController {
  constructor(
    private readonly authsService: AuthsService,
    private readonly usersServices: UsersService,
  ) {}

  @Public()
  @Post('register')
  @ResponseMessage('otp sẽ hết hạn sau 10 phút')
  register(@Body() registerDto: CreateAuthDto) {
    return this.authsService.handleRegister(registerDto);
  }

  @Post('login')
  @Public()
  @UseGuards(LocalAuthGuard)
  @ResponseMessage('Fetch login')
  async handleLogin(@Request() req) {
    return this.authsService.login(req.user);
  }

  @Public()
  @Post('verify')
  async Verify(@Body() verifyDto: VerifyAuthDto) {
    return await this.usersServices.handleVerify(verifyDto);
  }
  @Public()
  @Post('resend-active-code')
  async ResendActiveCode(@Body() activeDto: ActiveAuthDto) {
    return await this.authsService.handleSendCode(activeDto);
  }
}
