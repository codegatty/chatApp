import { inject, Injectable } from '@angular/core';
import { io, Socket } from 'socket.io-client';
import { Observable,firstValueFrom } from 'rxjs';
import { Ichat } from '../interface/char_response';
import { AuthService } from './auth.service';
import { HttpClient } from '@angular/common/http';
//chatMessage(text:string)
//listChat
//deleteChat(chat:Ichat)

@Injectable({
  providedIn: 'root',
})
export class ChatService {
  private authService = inject(AuthService);
  private socket: Socket;
  private httpClient=inject(HttpClient)

  constructor() {
    //connect is a built in event that listen for the successful connection to the websocket sever
    this.socket = io('http://localhost:3002', {});
    this.socket.on('connect', () => {
      console.log('Connected to socket server');
    });
  }

  joinChat(email: string): void {
    this.socket.emit('user-joined', { message: email + ' joined the chat' });
  }

  onSomeOneJoin():Observable<string>{
    return new Observable((observer)=>{
      this.socket.on('user-joined',(payload:{message:string})=>{
        observer.next(payload.message);
      })

    });
  }

  // Listen for new messages
  onNewMessage(): Observable<Ichat> {
    return new Observable((observer) => {
      this.socket.on('message', (message: Ichat) => {
        observer.next(message);
      });
    });
  }


  // Listen for user online status

  disconnect(): void {
    if (this.socket) {
      this.socket.disconnect();
    }
  }

  // Send a message
  sendMessage( text:string): void {
    if(this.authService.user){
    const payload:Ichat={
      createdAt:new Date(),
      message:text,
      userId:this.authService.user?.id
    }
    this.socket.emit('message', payload);
  }
    
  }
  async chatMessage(text: string) {}

   async listChat() {
    const data=await firstValueFrom(this.httpClient.get('http://localhost:3000/chat/allChat'))
    return data
  }

  async deleteMessage(message: Ichat) {}
}
