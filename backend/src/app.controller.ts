import { Body, Controller, Get,Post } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('/check')
  getHello(): string {
    return this.appService.getHello();
  }
  @Post()
  create(@Body() data:any){
    
  }

}