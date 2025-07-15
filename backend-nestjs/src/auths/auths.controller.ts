import {
  Controller,
  Get,
  Post,
  Body,
  UseGuards,
  Request,
  Req,
} from '@nestjs/common';
import {
  ActiveAuthDto,
  CreateAuthDto,
  VerifyAuthDto,
} from './dto/create-auth.dto';
import { Public, ResponseMessage } from './decorator/customize';
import { AuthsService } from './auths.service';
import { LocalAuthGuard } from './passport/local-auth.guard';
import { UsersService } from '@/modules/users/users.service';
import { Throttle } from '@nestjs/throttler';
import { JwtAuthGuard } from './passport/jwt-auth.guard';

export interface AuthenticatedRequest extends Request {
  user: {
    id: string;
    username: string;
  };
}
@Controller('auths')
export class AuthsController {
  constructor(
    private readonly authsService: AuthsService,
    private readonly usersServices: UsersService,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Get('me')
  async getMe(@Req() req) {
    return this.authsService.updateSession(req.user);
  }

  @Public()
  @Post('register')
  @Throttle({ default: { limit: 1, ttl: 2 * 60 * 1000 } })
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
  @Throttle({ default: { limit: 1, ttl: 1.5 * 60 * 1000 } })
  async ResendActiveCode(@Body() activeDto: ActiveAuthDto) {
    return await this.authsService.handleSendCode(activeDto);
  }
}
