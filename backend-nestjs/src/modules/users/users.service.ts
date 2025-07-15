import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
// import { v4 as uuidv4 } from 'uuid';
import { hashPasswordHelper } from '@/helper/util';
import aqp from 'api-query-params';
import { validate as isUuid } from 'uuid';
import { MailerService } from '@nestjs-modules/mailer';
import {
  ActiveAuthDto,
  CreateAuthDto,
  VerifyAuthDto,
} from '@/auths/dto/create-auth.dto';
import dayjs from 'dayjs';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private readonly mailerService: MailerService,
  ) {}

  isEmailExist = async (email: string) => {
    const user = await this.userRepository.findOne({ where: { email } });
    if (user) return true;
    return false;
  };
  isUsernameExist = async (username: string) => {
    const user = await this.userRepository.findOne({ where: { username } });
    if (user) return true;
    return false;
  };
  async create(createUserDto: CreateUserDto) {
    const { username, name, email, password, phone, bio, image } =
      createUserDto;
    const errors: string[] = [];
    const emailExist = await this.isEmailExist(email);
    const usernameExist = await this.isUsernameExist(username);
    if (emailExist) {
      errors.push(`Email: ${email} đã tồn tại`);
    }
    if (usernameExist) {
      errors.push(`Tên tài khoản: ${username} đã tồn tại`);
    }
    if (errors.length > 0) {
      throw new BadRequestException(errors);
    }
    //hash password
    const hashPassword = await hashPasswordHelper(password);
    const user = await this.userRepository.create({
      username,
      email,
      password: hashPassword,
      name,
      phone,
      bio,
      image,
    });
    await this.userRepository.save(user);
    return {
      id: user.id,
      username: user.username,
      email: user.email,
    };
  }

  async handleRegister(registerDto: CreateAuthDto) {
    const { username, email, password, name } = registerDto;
    //check email & username
    const emailExist = await this.isEmailExist(email);
    const usernameExist = await this.isUsernameExist(username);
    if (emailExist) {
      throw new BadRequestException(`Email đã tồn tại`);
    }
    if (usernameExist) {
      throw new BadRequestException(`Tên tài khoản đã tồn tại`);
    }
    //hash password
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const hashPassword = await hashPasswordHelper(password);
    const codeId = Math.floor(100000 + Math.random() * 900000);
    // const codeId = Math.floor(100000 + Math.random() * 900000);
    const avatarColors = [
      '#fde3cf',
      '#b5ead7',
      '#f1c0e8',
      '#caffbf',
      '#a0c4ff',
      '#ffd6a5',
      '#fdffb6',
      '#bdb2ff',
    ];
    const randomColor =
      avatarColors[Math.floor(Math.random() * avatarColors.length)];

    const user = this.userRepository.create({
      username,
      email,
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      password: hashPassword,
      avatarColor: randomColor,
      name: name,
      isActive: false,
      codeId: codeId.toString(),
      codeExpired: dayjs().add(10, 'minutes').toDate(),
    });
    await this.userRepository.save(user);

    //response
    this.mailerService.sendMail({
      to: user.email, // list of receivers
      subject: 'Kích hoạt tài khoản', // Subject line
      template: 'register',
      context: {
        name: name ?? username,
        activationCode: codeId,
      },
    });
    //send email

    return {
      id: user.id,
      username: user.username,
      email: user.email,
    };
  }

  async handleVerify(data: VerifyAuthDto) {
    const user = await this.userRepository.findOne({
      where: { id: data.id },
    });
    if (!user) {
      throw new BadRequestException(
        'Tài khoản đã bị xoá khỏi hệ thống, vui lòng đăng ký lại',
      );
    }
    if (user.codeId !== data.code) {
      throw new BadRequestException('Mã xác thực không hợp lệ');
    }
    const expiredCheck = dayjs().isBefore(user.codeExpired);
    if (expiredCheck) {
      await this.userRepository.update({ id: data.id }, { isActive: true });
    } else {
      throw new BadRequestException('Mã xác thực đã hết hạn');
    }
    return user;
  }

  async findAll(query: string, current: number, pageSize: number) {
    const { filter, sort } = aqp(query);
    if (filter.current) delete filter.current;
    if (filter.pageSize) delete filter.pageSize;
    if (!current) current = 1;
    if (!pageSize) pageSize = 10;
    const skip = (current - 1) * pageSize;

    const totalItems = await this.userRepository.count({ where: filter });
    const totalPages = Math.ceil(totalItems / pageSize);

    const results = await this.userRepository.find({
      where: filter,
      take: pageSize,
      skip: skip,
      order: sort,
      select: {
        password: false,
      },
    });

    return {
      meta: {
        current: current,
        pageSize: pageSize,
        pages: totalPages,
        total: totalItems,
      },
      results,
    };
  }

  async findOne(id: string) {
    return await this.userRepository.findOne({ where: { id } });
  }

  async findByEmail(email: string) {
    return await this.userRepository.findOne({ where: { email } });
  }

  async findByUsername(username: string) {
    return await this.userRepository.findOne({ where: { username } });
  }

  async update(updateUserDto: UpdateUserDto) {
    const { id, ...data } = updateUserDto;
    //kiểm tra tồn tại
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) throw new NotFoundException('id không tồn tại');

    await this.userRepository.update(id, data);
    return await this.userRepository.findOne({
      where: { id },
    });
  }

  async remove(id: string) {
    //check id hợp lệ:
    if (!isUuid(id))
      throw new BadRequestException('id không đúng định dạng UUID');

    const result = await this.userRepository.delete(id);
    if (result.affected === 0) {
      throw new BadRequestException('id không tồn tại');
    }
    return { deleted: true };
  }
  async handleSendCode(data: ActiveAuthDto) {
    const { username, email } = data;
    const user = await this.userRepository.findOne({
      where: { username: username },
    });
    if (!user) {
      throw new BadRequestException(
        'Tài khoản đã bị xoá khỏi hệ thống, vui lòng đăng ký lại',
      );
    }
    if (user.email !== email) {
      throw new BadRequestException('Email không khớp với tài khoản');
    }
    const newCode = Math.floor(100000 + Math.random() * 900000).toString();

    //response
    this.mailerService.sendMail({
      to: user.email, // list of receivers
      subject: 'Kích hoạt tài khoản', // Subject line
      template: 'register',
      context: {
        name: user.name ?? username,
        activationCode: newCode,
      },
    });
    await this.userRepository.update(
      { username: username },
      { codeId: newCode, codeExpired: dayjs().add(10, 'minutes').toDate() },
    );
    //send email
    return {
      id: user.id,
      username: user.username,
      email: user.email,
    };
  }

  async updateImage(userId: string, imageUrl: string) {
    const fullImageUrl = `${process.env.BACKEND_URL}${imageUrl}`;
    await this.userRepository.update(userId, {
      image: fullImageUrl,
      avatarColor: null,
    });
    return {
      imageUrl: fullImageUrl,
    };
  }
}
