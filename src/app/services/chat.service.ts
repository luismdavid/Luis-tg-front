import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { ChatModel } from '../models/chat.model';
import { MessageModel } from '../models/message.model';

@Injectable({
  providedIn: 'root',
})
export class ChatService {
  constructor(private socket: Socket, private http: HttpClient) {
    this.socket.connect();
  }

  searchChats(userId: string) {
    this.socket.emit('get-chats', { userId });
  }

  subChats(): Observable<ChatModel[]> {
    return this.socket.fromEvent<ChatModel[]>('chats-changed').pipe(
      map((x) => x.map(chat => ({
        ...chat,
        messages: chat.messages.map(mes => ({ ...mes, sentDate: new Date(mes.sentDate )}))
      }))) 
    );
  }

  createNewChat(newChat: ChatModel) {
    return this.http.post(environment.API + '/chats', newChat);
  }

  joinChat(chatId: string, userId: string) {
    return this.socket.emit('join-chat', { chatId, userId });
  }

  subSingleChat(): Observable<ChatModel> {
    return this.socket.fromEvent('chat-changed');
  }

  subNewMessages(): Observable<MessageModel> {
    return this.socket.fromEvent('new-message');
  }

  sendMessage(chatId: string, message: MessageModel) {
    return this.http.post<MessageModel>(environment.API + '/chats/message?chatId=' + chatId, message);
  }

  uploadMessageImage(image: File | Blob) { 
    const fd = new FormData();
    fd.append('file', image);
    return this.http.post(environment.API + '/chats/message/upload', fd);
  }

  deleteChatParticipant(chatId: string) {
    return this.http.delete(`${environment.API}/chats/message?chatId=${chatId}`);
  }
}
