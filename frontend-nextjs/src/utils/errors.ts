import { AuthError } from "next-auth";

export class CustomAuthError extends AuthError {
  static type: string;

  constructor(message?: any) {
    super();

    this.type = message;
  }
}
export class InvalidEmailPasswordError extends AuthError {
  constructor() {
    super();
    this.name = "InvalidEmailPasswordError";
  }
}
export class ActiveAccountError extends AuthError {
  constructor() {
    super();
    this.name = "ActiveAccountError";
  }
}
export class RateLimitError extends AuthError {
  constructor() {
    super();
    this.name = "RateLimitError";
  }
}