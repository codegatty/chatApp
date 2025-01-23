import {Injectable} from '@nestjs/common'
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { Auth2Service } from '../auth2.service';
@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy){
    constructor(private readonly auth2Service:Auth2Service){
        super({
            usernameField:'email',
            passwordField:'password'
        })
    }

    async validate(email:string,passport:string) {
        return this.auth2Service.verifyUser(email,passport)
    }
}
