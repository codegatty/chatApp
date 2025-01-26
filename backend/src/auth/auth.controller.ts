import { Body, Controller, Post, Get,Res,Req, HttpException,HttpStatus, UseGuards, UseInterceptors, UploadedFile,FileTypeValidator, MaxFileSizeValidator, ParseFilePipe } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { AuthService } from './auth.service';
import { LoginUserDto } from './dto/login-user.dto';
import {ConfigService} from '@nestjs/config'
import { AuthGuard } from 'src/guards/auth/auth.guard';
import { FileInterceptor } from '@nestjs/platform-express';
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService,private readonly configService: ConfigService) {}

  //todo:Sign Up
  @Post('signup')
  @UseInterceptors(FileInterceptor('avatar'))
  async signUp(@Body() signUpData: CreateUserDto,@UploadedFile(new ParseFilePipe({
    validators:[
      new MaxFileSizeValidator({ maxSize: 5242880  }),
      new FileTypeValidator({ fileType: 'image/jpeg' }),
    ],
  })) file:Express.Multer.File) {
    return await this.authService.registerUser(signUpData,file.filename);
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
      path:'/',
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
  //todo: logout the user
  @Post('logout')
  logout(@Req() req, @Res() res): void {

    const refreshToken=req.cookies['refreshToken']

    if(!refreshToken)
      throw new HttpException("Invalid refresh token",HttpStatus.UNAUTHORIZED)
    // Clear the HTTP-only refresh token cookie
    res.clearCookie('refreshToken', { httpOnly: true,path:'/'});
  
    // Optionally, send a success response
    res.status(200).json({ message: 'Successfully logged out' });
  }

  //TODO:TEST OF AUTHENTICATED ENDPOINT
  @Get('test')
  @UseGuards(AuthGuard)
  async test(@Req() req){
    return {message:'Authenticated endpoint accessed', user:req.userId}  // req.user contains the authenticated user objectreq.userId
  }

}

