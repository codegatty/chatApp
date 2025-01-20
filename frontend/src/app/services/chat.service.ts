import { Injectable } from '@angular/core';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { environment } from '../env/env.development';
import { Ichat } from '../interface/char_response';

@Injectable({
  providedIn: 'root',
})
export class ChatService {
  private supeBase?: SupabaseClient;
  constructor() {
    this.supeBase = createClient(
      environment.supabaseUrl,
      environment.supabaseKey
    );
  }

  async chatMessage(text:string){
    try{
      const response=await this.supeBase?.from('chats').insert({text})

      if(response?.data){
        return response.data
      }else{
        console.error('Error sending chat message:', response?.error?.message)
        return null
      }
    }catch(err){
      console.error('Error sending chat message:', err)
      return null
    }
  }

  async listChat(){
    try{
      const response=await this.supeBase?.from('chats').select('*,users(*)')
      if(response?.error){
        alert("error"+response.error.message)
      }
      return response?.data
    }catch(err){
      throw err
    }
  }

  async deleteMessage(message:Ichat){
    const data=await this.supeBase?.from('chats').delete().eq('id',message.id)
    return data
  }

}
