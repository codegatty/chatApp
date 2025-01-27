import { Controller,Get } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';

@Controller('chat')
export class ChatController {

    constructor(private readonly databaseService: DatabaseService) {}

    @Get('allChat')
    async getAllChatFromDatabase()
    {
        const result=await this.databaseService.chat.findMany()
        return result;

    }
}
