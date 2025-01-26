import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import { Prisma } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { LoginUserDto } from './dto/login-user.dto';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
@Injectable()
export class AuthService {
  constructor(
    private readonly databaseService: DatabaseService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}
  async registerUser(user: Prisma.UserCreateInput, fileName: string) {
    let existingUser: Prisma.UserCreateInput;
    try {
      existingUser = await this.databaseService.user.findUnique({
        where: {
          email: user.email,
        },
      });
    } catch (error) {
      throw new HttpException('Something went wrong', HttpStatus.BAD_REQUEST);
    }

    if (existingUser) {
      throw new HttpException(
        'The user does already Existed',
        HttpStatus.CONFLICT,
      );
    }
    const hashedPassword = await bcrypt.hash(user.password, 10);
    try {
      await this.databaseService.user.create({
        data: { ...user, password: hashedPassword, avatarUrl: fileName },
      });
    } catch (e) {
      console.log(e);
      if (e instanceof Prisma.PrismaClientKnownRequestError) {
        throw new HttpException(
          `Database error: ${e.message}`,
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
      console.error('Unexpected error during user registration:', e);
      throw new HttpException(
        'Something went wrong during user registration',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
    return {
      message: 'user created successfully',
      data: { ...user, avatarUrl: fileName },
    };
  }

  async loginUser(userData: LoginUserDto) {
    const { email, password } = userData;
    let user:Prisma.UserCreateInput
    try {
      user = await this.databaseService.user.findUnique({
        where: { email: email },
      });
    } catch (e) {
      console.log(e);
      throw new HttpException('Something Went Wrong', HttpStatus.BAD_REQUEST);
    }
    //?STEP ONE :FIND THE USER
    if (!user) {
      throw new HttpException('Wrong Credential', HttpStatus.UNAUTHORIZED);
    }
    //?STEP TWO :COMPARE HASHED PASSWORD
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      throw new HttpException('Wrong Credential', HttpStatus.UNAUTHORIZED);
    }
    //?STEP THREE: GENERATE JWT TOKEN
    const accessToken = await this.generateJWTToken(
      user.id,
      this.configService.get<string>('expireTime.accessToken'),
    );
    const refreshToken = await this.generateJWTToken(
      user.id,
      this.configService.get<string>('expireTime.refreshToken'),
    );
    
    return {
      message: 'logged in successfully',
      ...user,
      accessToken,
      refreshToken,
    };
  }

  //? STEP FOUR: GENERATE ACCESS TOKEN
  async generateAccessToken(token: string) {
    try {
      const payload = await this.jwtService.verify(token);
      const userId = payload.userId;
      const userExist = await this.databaseService.user.findUnique({
        where: {
          id: payload.userId,
        },
      });

      if (!userExist)
        throw new HttpException('UNAUTHORIZED access', HttpStatus.UNAUTHORIZED);

      const accessToken = await this.generateJWTToken(userId, '1m');

      return { ...userExist,accessToken };
    } catch (e) {
      throw new HttpException(
        'Something went wrong while generating refresh token',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async generateJWTToken(userId: string, expireTime: string) {
    return await this.jwtService.sign({ userId }, { expiresIn: expireTime });
  }
}
