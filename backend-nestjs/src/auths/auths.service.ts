import { Injectable } from '@nestjs/common';
import {
  ActiveAuthDto,
  CreateAuthDto,
  VerifyAuthDto,
} from './dto/create-auth.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { UsersService } from '@/modules/users/users.service';
import { JwtService } from '@nestjs/jwt';
import { comparePasswordHelper } from '@/helper/util';

@Injectable()
export class AuthsService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}
  handleRegister = async (registerDto: CreateAuthDto) => {
    return await this.usersService.handleRegister(registerDto);
  };
  async validateUser(username: string, pass: string): Promise<any> {
    const user = await this.usersService.findByUsername(username);

    if (!user) return null;
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const isValidPassword = await comparePasswordHelper(pass, user.password);
    if (!isValidPassword) return null;
    return user;
  }

  async login(user: any) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
    const payload = { username: user.username, sub: user.id };
    return {
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        name: user.name,
        role: user.role,
        image: user.image,
      },
      access_token: this.jwtService.sign(payload),
    };
  }
  handleSendCode = async (data: ActiveAuthDto) => {
    return await this.usersService.handleSendCode(data);
  };
}
