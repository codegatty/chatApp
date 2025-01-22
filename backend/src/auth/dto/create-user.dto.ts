import { IsString,IsNotEmpty,IsEmail, MinLength, IsOptional} from 'class-validator'
export class CreateUserDto {
    @IsNotEmpty()
    @IsEmail()
    email: string;
    @IsNotEmpty()
    @IsString()
    @MinLength(8)
    password: string;
    @IsOptional()
    @IsNotEmpty()
    @IsString()
    avatarUrl: string; // admin, user, guest
}