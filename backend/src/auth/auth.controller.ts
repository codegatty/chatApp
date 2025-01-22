import { Body, Controller, Post, Get,Res,Req, HttpException,HttpStatus, UseGuards } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { AuthService } from './auth.service';
import { LoginUserDto } from './dto/login-user.dto';
import {ConfigService} from '@nestjs/config'
import { AuthGuard } from 'src/guards/auth/auth.guard';
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService,private readonly configService: ConfigService) {}

  //todo:Sign Up
  @Post('signup')
  async signUp(@Body() signUpData: CreateUserDto) {
    return await this.authService.registerUser(signUpData);
  }
  //todo: login User
  @Post('login')
  async login(@Res() resp, @Body() loginData: LoginUserDto) {
    const { refreshToken, ...response } =
      await this.authService.loginUser(loginData);
    console.log(refreshToken);
    resp.cookie('refreshToken', refreshToken, {
      httpOnly: true, // Prevent JavaScript access
      sameSite: 'strict', // Prevent CSRF
      maxAge: parseInt(this.configService.get<string>('expireTime.cookie'))// 7 days in milliseconds
    });
    return resp.send(response);
  }
  //todo: sends access token
  @Post('refresh')
  async refresh(@Req() req ){
    const refreshToken=req.cookies['refreshToken']
    if(!refreshToken)
      throw new HttpException("Invalid refresh token",HttpStatus.UNAUTHORIZED)

    return this.authService.generateAccessToken(refreshToken)
  }

  //TODO:TEST OF AUTHENTICATED ENDPOINT
  @Get('test')
  @UseGuards(AuthGuard)
  async test(@Req() req){
    return "hello by authentication"+req.userId
  }

}

