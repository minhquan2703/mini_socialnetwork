import { IsEmail, IsNotEmpty, IsOptional } from 'class-validator';

export class CreateAuthDto {
  @IsNotEmpty({ message: 'username không được để trống' })
  username: string;

  @IsNotEmpty({ message: 'email không được để trống' })
  @IsEmail({}, { message: 'email sai định dạng' })
  email: string;

  @IsNotEmpty({ message: 'password không được để trống' })
  password: string;

  @IsOptional()
  name: string;
}

export class VerifyAuthDto {
  @IsNotEmpty({ message: 'id không được để trống' })
  id: string;

  @IsNotEmpty({ message: 'code không được để trống' })
  code: string;
}
export class ActiveAuthDto {
  @IsNotEmpty({ message: 'username không được để trống' })
  username: string;

  @IsNotEmpty({ message: 'email không được để trống' })
  email: string;
}
