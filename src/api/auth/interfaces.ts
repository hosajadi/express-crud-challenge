export interface IRegisterUser {
    name: string;
    email: string;
    password: string;
    avatars: string[];
}

export interface ILoginUser{
    email: string;
    password: string;
}

export interface IUpdateUser{
    name?: string;
    bio?: string;
    latitude?: string;
    longitude?: string;
}
