import { HttpException, HttpStatus, Injectable, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { DatabaseService } from 'src/database/database.service';

@Injectable()
export class Auth2Service {

    constructor(private readonly databaseService:DatabaseService){}
    async verifyUser(email:string,passport:string){
        try{
          const user =await this.databaseService.user.findUnique({
            where:{
              email: email
            }
          })  
          const authenticated=await bcrypt.compare(passport,user.password) 
          if(!authenticated)
                throw new HttpException("UNAUTHORIZED",HttpStatus.UNAUTHORIZED)
        }catch(err){
            console.log(err)
            throw new HttpException("UNAUTHORIZED",HttpStatus.UNAUTHORIZED)
        }
    }
}
