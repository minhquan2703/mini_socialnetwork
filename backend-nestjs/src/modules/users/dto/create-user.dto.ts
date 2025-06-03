import { IsEmail, IsNotEmpty } from 'class-validator';

export class CreateUserDto {
  @IsNotEmpty({ message: 'username không được để trống' })
  username: string;

  @IsNotEmpty({ message: 'email không được để trống' })
  @IsEmail({}, { message: 'email sai định dạng' })
  email: string;

  @IsNotEmpty({ message: 'password không được để trống' })
  password: string;

  name: string;
  phone: string;
  bio: string;
  image: string;
}
