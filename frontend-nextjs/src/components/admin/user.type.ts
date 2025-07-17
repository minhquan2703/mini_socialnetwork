export interface IUserData {
    id: string;
    name: string;
    email: string;
    phone?: string;
}

export interface IMetaData {
    current: number;
    pageSize: number;
    pages: number;
    total: number;
}

export interface IUpdateUserFormValues {
    name: string;
    email: string;
    phone?: string;
}

export interface ICreateUserFormValues {
    username: string;
    email: string;
    name: string;
    password: string;
}