import { Module } from '@nestjs/common';
import { ChatService } from './chat.service';
import { ChatController } from './chat.controller';
import { ChatGateway } from './chat.gateway';
import { DatabaseModule } from 'src/database/database.module';
@Module({
  providers: [ChatService, ChatGateway],
  controllers: [ChatController],
  imports:[DatabaseModule]
})
export class ChatModule {}
