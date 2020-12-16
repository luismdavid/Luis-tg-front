import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ModalController } from '@ionic/angular';
import { NbChatComponent } from '@nebular/theme';
import { Subscription } from 'rxjs';
import { filter, switchMap, tap } from 'rxjs/operators';
import { ImagePickerComponent } from 'src/app/components/image-picker/image-picker.component';
import { ChatModel } from 'src/app/models/chat.model';
import { MessageModel } from 'src/app/models/message.model';
import { UserModel } from 'src/app/models/user.model';
import { AuthService } from 'src/app/services/auth.service';
import { ChatService } from 'src/app/services/chat.service';
import { ToastService } from 'src/app/services/toast.service';
import { EditChatModalComponent } from './edit-chat-modal/edit-chat-modal.component';

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
  isAdmin: boolean = false;
  subs: Subscription = new Subscription();
  @ViewChild('imagePicker') picker: ImagePickerComponent;
  @ViewChild('chat') chat: NbChatComponent;

  constructor(
    private authService: AuthService,
    private activatedRoute: ActivatedRoute,
    private chatService: ChatService,
    private modalCtrl: ModalController,
    private toast: ToastService
  ) {}

  ngOnInit() {
    this.loading = true;
    this.subs.add(
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
        })
    );

    this.subs.add(
      this.chatService.subNewMessages().subscribe((newMsg) => {
        (this.currentChat.messages as MessageModel[]).push(newMsg);
      })
    );
  }

  ionViewDidLeave() {
    this.subs.unsubscribe();
    this.chatService.closeSingleChat();
  }

  subscribeCurrentChat() {
    this.subs.add(
      this.chatService.subSingleChat().subscribe((chat) => {
        console.log(chat);
        this.currentChat = chat;
        this.isAdmin = !!(chat.admins as UserModel[]).find(
          (x) => x._id === this.currentUser._id
        );
        this.chat.scrollListBottom();
        this.loading = false;
      })
    );
  }

  async openEditModal() {
    const modal = await this.modalCtrl.create({
      component: EditChatModalComponent,
      componentProps: {
        currentChat: this.currentChat,
        currentUser: this.currentUser,
      },
    });
    modal.present();
    const { data } = await modal.onWillDismiss();
    if (!data) return;
    this.currentChat = data;
  }

  uploadMsgWithImg(image: File | Blob) {
    this.chatService
      .uploadMessageImage(image)
      .pipe(
        tap(({ url }: { url: string }) => {
          this.sendMessage(
            {
              message: '',
              files: [{ url, type: image.type }],
            },
            'file'
          );
        })
      )
      .subscribe();
  }
  sendMessage(
    message: { message: string; files: any[] },
    type: 'text' | 'file' = 'text'
  ) {
    if (this.currentChat.type === 'channel' && !this.isAdmin) {
      return this.toast.show(
        'Este es un canal cerrado, solo los administradores pueden enviar mensajes.'
      );
    }
    if (message.message === '/image') {
      return this.picker.onPickImage();
    }
    this.loading = true;
    const newMsg: MessageModel = {
      type,
      content: message.message,
      sender: this.currentUser._id,
      sentDate: new Date(),
      attachments: [],
    };
    if (type == 'file') {
      newMsg.attachments = message.files;
    }

    console.log(newMsg);

    this.chatService
      .sendMessage(this.currentChat._id, newMsg)
      .subscribe(() => (this.loading = false));
  }
}
