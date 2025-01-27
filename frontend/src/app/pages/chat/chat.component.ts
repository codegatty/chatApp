import {
  Component,
  inject,
  effect,
  signal,
  OnDestroy,
  
  OnInit,
} from '@angular/core';
// import { AuthService } from '../../services/auth.service';
import { ChatService } from '../../services/chat.service';
import {
  ReactiveFormsModule,
  FormControl,
  Validators,
  FormGroup,
} from '@angular/forms';
import { Ichat } from '../../interface/char_response';
import { DatePipe } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { AuthService } from '../../services/auth.service';
export interface ChatMessage {
  senderId: string;
  receiverId: string;
  content: string;
  timestamp: Date;
}
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [ReactiveFormsModule, NgClass],
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.css',
})
export class ChatComponent implements OnInit, OnDestroy {
  // private auth=inject(AuthService)
  private chat = inject(ChatService);
  private http = inject(HttpClient);
  private authSerivece = inject(AuthService);
  joined = signal<string>('');
  chats = signal<Ichat[]>([]);
  chatForm = new FormGroup({
    text: new FormControl('', [Validators.required, Validators.minLength(1)]),
  });
    messages=signal<string[]>([]);
  receiverId = '';
  ngOnInit(): void {
    this.chat.joinChat(this.authSerivece.user?.email ?? 'Guest');

    this.chat.onSomeOneJoin().subscribe({
      next: (message: string) => {
        if (message) {
          this.joined.update((prev) => prev + ',' + message);
        }
      },
    });

    this.chat.onNewMessage().subscribe({
      next: (message: string) => {
        
        this.messages.update((prev)=>[message,...prev])
      },
    });
  }

  constructor() {
    effect(() => {
      //this.onListChat()
    });
  }
  sendMessage() {
    const text = this.chatForm.controls['text'].value;
    if (text) {
      this.chat.sendMessage(text);
    }
  }
  ngOnDestroy() {
    this.chat.disconnect();
  }

  signOut() {
    this.authSerivece.logout();
  }

  async test() {
    console.log(this.authSerivece.user);

    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.authSerivece.getAccessToken()}`, // Include the Bearer token in the Authorization header
    });
    const result = await firstValueFrom(
      this.http.get('http://localhost:3000/auth/test', {
        withCredentials: true,
      })
    );
    console.log(result);
  }

  getColor(index:number){
    const val=((index%6)*300).toString()
    console.log(val)
    return 'bg-yellow-'+val
  }
}
