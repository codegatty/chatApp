import { IsNotEmpty,IsEmail,MinLength } from "class-validator";

export class LoginUserDto{
    @IsNotEmpty()
    @IsEmail()
    email: string;
    @IsNotEmpty()
    @MinLength(8)
    password: string; // hashed password in database.
}