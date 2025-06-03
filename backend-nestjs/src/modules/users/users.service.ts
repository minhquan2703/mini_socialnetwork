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
import { v4 as uuidv4 } from 'uuid';
import { hashPasswordHelper } from '@/helper/util';
import aqp from 'api-query-params';
import { validate as isUuid } from 'uuid';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
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

  // async findAll(query: string, current: number, pageSize: number) {
  //   const { filter, sort } = aqp(query);
  //   if (filter.current) delete filter.current;
  //   if (filter.pageSize) delete filter.pageSize;
  //   if (!current) current = 1;
  //   if (!pageSize) pageSize = 10;
  //   const totalItems = (await this.userRepository.find(filter)).length;
  //   const totalPages = Math.ceil(totalItems / pageSize);
  //   const skip = (current - 1) * pageSize;

  //   const results = await this.userModel
  //     .find(filter)
  //     .limit(pageSize)
  //     .skip(skip)
  //     .select('-password')
  //     .sort(sort as any);
  //   return { results, totalPages };
  // }
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
    });

    const resultsWithoutPassword = results.map(
      ({ password, ...results }) => results,
    );

    return { results: resultsWithoutPassword, totalPages };
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
    return await this.userRepository.findOne({ where: { id } });
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
}
