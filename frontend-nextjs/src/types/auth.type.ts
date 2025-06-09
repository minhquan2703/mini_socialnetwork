// Authentication related types
export interface IRegister {
    name: string;
    email: string;
    username: string;
    password: string;
}
export interface IResendCode {
    username: string;
    email: string;
}
export interface IVerifyAccount {
    id: string;
    code: string;
}


