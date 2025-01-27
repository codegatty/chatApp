import { Inject } from '@nestjs/common';
import { MessageBody, SubscribeMessage, WebSocketGateway,OnGatewayConnection,OnGatewayDisconnect, WebSocketServer ,ConnectedSocket} from '@nestjs/websockets';
import {Socket,Server,} from 'socket.io'
import { DatabaseService } from 'src/database/database.service';

type Ichat= {createdAt:string, message:string,userId:string}

@WebSocketGateway(3002,{cors:{origin:'*'}})
export class ChatGateway implements OnGatewayConnection,OnGatewayDisconnect{
  
  @WebSocketServer()
  server:Server

  constructor(private readonly databaseService:DatabaseService){}
  
  private activeUsers: Map<string, string> = new Map();


  @SubscribeMessage('user-joined')
  handleConnection(@ConnectedSocket() client:Socket,@MessageBody() data:any,) {
    
    if(data){
      client.emit('user-joined',{message:'You are joining this chat'})
    client.broadcast.emit("user-joined",{message:data.message})
    }
    
  }

  handleDisconnect(client:Socket) {
    const userId = this.activeUsers.get(client.id);
    this.activeUsers.delete(client.id);
    this.server.emit('userOffline', userId);
    console.log(`Client disconnected: ${client.id}`);
  }

    @SubscribeMessage('message')
    async handleMessage(
      @ConnectedSocket() client: Socket,
      @MessageBody() data:Ichat
    ) {
      client.emit('message',data)
      client.broadcast.emit('message',data)
      try{
      await this.databaseService.chat.create({
        data:data
      })}catch(e){
        console.log(e)
      }

    }

}
