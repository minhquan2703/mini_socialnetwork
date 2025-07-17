import { AuthError } from "next-auth";

export class CustomAuthError extends AuthError {
  static type: string;

  constructor(message?: any) {
    super();

    this.type = message;
  }
}
export class InvalidEmailPasswordError extends AuthError {
  static type = "Tên tài khoản hoặc mật khẩu không hợp lệ"
}
export class ActiveAccountError extends AuthError {
  static type = "Tài khoản chưa được kích hoạt"
}