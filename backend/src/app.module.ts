import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { DatabaseModule } from './database/database.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import config from 'config/config';
import { JwtModule } from '@nestjs/jwt';
import { ChatModule } from './chat/chat.module';
@Module({
  imports: [ConfigModule.forRoot({
    load: [config],
    isGlobal: true,
    envFilePath: '.env',
  }),
  JwtModule.registerAsync({
   imports:[ConfigModule],
   useFactory:async (config)=>({
    secret: config.get('jwt.secret')
   }),
   global:true,
   inject:[ConfigService]
  })
  
  ,AuthModule, DatabaseModule, ChatModule],
})
export class AppModule {}
