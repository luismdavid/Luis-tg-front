import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NbChatComponent } from '@nebular/theme';
import { filter, switchMap, tap } from 'rxjs/operators';
import { ImagePickerComponent } from 'src/app/components/image-picker/image-picker.component';
import { ChatModel } from 'src/app/models/chat.model';
import { MessageModel } from 'src/app/models/message.model';
import { UserModel } from 'src/app/models/user.model';
import { AuthService } from 'src/app/services/auth.service';
import { ChatService } from 'src/app/services/chat.service';

@Component({
  selector: 'app-chat-view',
  templateUrl: './chat-view.page.html',
  styleUrls: ['./chat-view.page.scss'],
})
export class ChatViewPage implements OnInit {
  currentUser: UserModel;
  currentChat: ChatModel;
  chatId: string;
  loading: boolean = false;
  @ViewChild('imagePicker') picker: ImagePickerComponent;
  @ViewChild('chat') chat: NbChatComponent;

  constructor(
    private authService: AuthService,
    private activatedRoute: ActivatedRoute,
    private chatService: ChatService
  ) {}

  ngOnInit() {
    this.loading = true;
    this.authService
      .subUser()
      .pipe(
        filter((user) => !!user),
        tap((user) => (this.currentUser = user)),
        switchMap(() => this.activatedRoute.params)
      )
      .subscribe((params) => {
        this.chatId = params.id;
        this.chatService.joinChat(params.id, this.currentUser._id);
        this.subscribeCurrentChat();
      });

    this.chatService.subNewMessages().subscribe((newMsg) => {
      this.currentChat.messages.push(newMsg);
    });
  }

  subscribeCurrentChat() {
    this.chatService.subSingleChat().subscribe((chat) => {
      console.log(chat);
      this.currentChat = chat;
      this.chat.scrollListBottom();
      this.loading = false;
    });
  }

  uploadMsgWithImg(image: File | Blob) {
    this.chatService.uploadMessageImage(image).pipe(
      tap(({ url }: { url: string }) => {
        this.sendMessage({
          message: '',
          files: [{ url, type: image.type }]
        }, 'file')
      })
    ).subscribe();
  }
  sendMessage(message: { message: string; files: any[] }, type: 'text' | 'file' = 'text') {
    if (message.message === '/image' ) {
      return this.picker.onPickImage();
    }
    const newMsg: MessageModel = {
      type,
      content: message.message,
      sender: this.currentUser._id,
      sentDate: new Date(),
      attachments: []
    };
    if (type == 'file') {
      newMsg.attachments = message.files;
    }

    console.log(newMsg);

    this.chatService.sendMessage(this.currentChat._id, newMsg).subscribe();
  }
}
