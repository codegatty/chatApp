import { Component, inject,effect,signal} from '@angular/core';
import { AuthService } from '../../auth.service';
import { ChatService } from '../../services/chat.service';
import { ReactiveFormsModule,FormControl, Validators, FormGroup } from '@angular/forms';
import { Ichat } from '../../interface/char_response';
import { DatePipe } from '@angular/common';
@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [ReactiveFormsModule,DatePipe],
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.css'
})
export class ChatComponent {
  private auth=inject(AuthService)
  private chat=inject(ChatService)
  chats=signal<Ichat[]>([])
 chatForm=    new FormGroup({
  text:new FormControl("",[Validators.required,Validators.minLength(1)])
})
   
  constructor(){
    effect(()=>{
      this.onListChat()
    })
  }

  signOut(){
    this.auth.signOut()
  }

  onSubmit(){
    if(this.chatForm?.valid){
    const value=this.chatForm.value.text as string
    this.chatForm.reset()
    this.chat.chatMessage(value)
    this.onListChat()
    }   
  }

  async onListChat(){
    const response:Ichat[]|null|undefined=await this.chat.listChat()
    if(response){
    this.chats.set(response)
  }
  }

  async onSelectMessageToDelete(message:Ichat){
    await this.chat.deleteMessage(message)
    this.onListChat()
  }




}
