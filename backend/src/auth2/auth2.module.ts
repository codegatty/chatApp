import { Module } from '@nestjs/common';
import { Auth2Controller } from './auth2.controller';
import { Auth2Service } from './auth2.service';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { DatabaseModule } from 'src/database/database.module';

@Module({
  imports:[PassportModule,JwtModule,DatabaseModule],
  controllers: [Auth2Controller],
  providers: [Auth2Service]
})
export class Auth2Module {}
