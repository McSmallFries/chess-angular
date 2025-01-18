export class User  {
    idUser: number = 0;
    username: string = '';
    email: string = '';
    constructor(username: string, email: string)  {
        this.username = username;
        this.email = email;
    }
}

export class UserPassword  {
    idUser: number = 0;
    password: string = '';
    constructor(id: number, pass: string)  {
        this.idUser = id;
        this.password = pass;
    }
}

export class LoginRequest  {
    user: User;
    userPassword: UserPassword
    constructor(u: User, up: UserPassword)  {
        this.user = u;
        this.userPassword = up;
    }
}