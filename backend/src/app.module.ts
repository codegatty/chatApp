import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { DatabaseModule } from './database/database.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import config from 'config/config';
import { JwtModule } from '@nestjs/jwt';
import { ChatModule } from './chat/chat.module';
import { Auth2Module } from './auth2/auth2.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [config],
      isGlobal: true,
      envFilePath: '.env',
    }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (config) => ({
        secret: config.get('jwt.secret'),
      }),

      global: true,
      inject: [ConfigService],
    }),
    ServeStaticModule.forRoot({//?exposes the upload folder as static 
      rootPath: join(__dirname, '..','..', 'uploads'),
      serveRoot: '/uploads',
      serveStaticOptions: {
        fallthrough: false,
      },
    }),
    AuthModule,
    DatabaseModule,
    ChatModule,
    Auth2Module,
  ],
})
export class AppModule {}
