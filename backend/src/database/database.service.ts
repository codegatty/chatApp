import { Injectable,OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class DatabaseService  extends PrismaClient implements OnModuleInit{
    async onModuleInit() {
        try{
        await this.$connect()
        console.log('Connected to Prisma database...')
        } catch(error:unknown){
            throw new Error("Something went wrong when connecting to Prisma database")
        }
    }

}
