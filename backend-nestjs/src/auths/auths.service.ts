import { BadRequestException, Injectable } from '@nestjs/common';
import { ActiveAuthDto, CreateAuthDto } from './dto/create-auth.dto';
import { UsersService } from '@/modules/users/users.service';
import { JwtService } from '@nestjs/jwt';
import { comparePasswordHelper } from '@/helper/util';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '@/modules/users/entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class AuthsService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
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

  async updateSession(user: any) {
    const payload = { username: user?.username, sub: user.id };
    const currentUser = await this.userRepository.findOne({
      where: { id: user.id },
    });
    if (!currentUser) {
      throw new BadRequestException('đã có lỗi xảy ra');
    }
    return {
      id: currentUser.id,
      username: currentUser.username,
      email: currentUser.email,
      name: currentUser.name,
      role: currentUser.role,
      image: currentUser.image,
      avatarColor: currentUser.avatarColor,
    };
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
        avatarColor: user.avatarColor,
      },
      access_token: this.jwtService.sign(payload),
    };
  }

  handleSendCode = async (data: ActiveAuthDto) => {
    return await this.usersService.handleSendCode(data);
  };
  uploadAvatar = async (userId: string, imageUrl: string) => {
    const fullImageUrl = `${process.env.BACKEND_URL}${imageUrl}`;
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new BadRequestException('Người dùng không tồn tại');
    }
    const payload = { username: user.username, sub: user.id };
    await this.userRepository.update(userId, {
      image: fullImageUrl,
      avatarColor: null,
    });
    return {
      imageUrl: fullImageUrl,
      access_token: this.jwtService.sign(payload),
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        name: user.name,
        role: user.role,
        image: user.image,
      },
    };
  };
}
