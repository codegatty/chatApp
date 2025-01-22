import { MessageBody, SubscribeMessage, WebSocketGateway,OnGatewayConnection,OnGatewayDisconnect, WebSocketServer } from '@nestjs/websockets';
import {Socket,Server} from 'socket.io'
@WebSocketGateway(3002,{cors:{origin:'*'}})
export class ChatGateway implements OnGatewayConnection,OnGatewayDisconnect{

  @WebSocketServer()
  server:Server

  handleConnection(client:Socket) {
    client.emit('user-joined',{message:'You are joining this chat'})
    client.broadcast.emit("user-joined",{message:client.id+"joined the chat"})
  }

  handleDisconnect(client:Socket) {
    client.emit('user-left',{message:'You are left this chat'})
    client.broadcast.emit("user-left",{message:client.id+"left the chat"})
  }
  @SubscribeMessage('message')
  handleMessage(client:Socket,message:any) {
    client.emit("message","your message "+message)
    client.broadcast.emit("message","message by "+client.id+" : "+message)
  }

}
