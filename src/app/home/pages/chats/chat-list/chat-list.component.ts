import { Component, OnInit } from '@angular/core';
import { LoadingController, NavController } from '@ionic/angular';
import { filter, switchMap, tap } from 'rxjs/operators';
import { ChatModel } from 'src/app/models/chat.model';
import { UserModel } from 'src/app/models/user.model';
import { AuthService } from 'src/app/services/auth.service';
import { ChatService } from 'src/app/services/chat.service';

@Component({
  selector: 'app-chat-list',
  templateUrl: './chat-list.component.html',
  styleUrls: ['./chat-list.component.scss'],
})
export class ChatListComponent implements OnInit {
  currentUser: UserModel;
  chats: ChatModel[] = [];
  loading: boolean = false;

  constructor(
    private authService: AuthService,
    private chatsService: ChatService,
    private navCtrl: NavController,
    private loadCtrl: LoadingController
  ) {}

  ngOnInit() {
    this.loading = true;
    this.authService
      .subUser()
      .pipe(
        filter((user) => !!user),
        tap((user) => {
          this.currentUser = user;
          this.chatsService.searchChats(user._id);
        }),
        switchMap((user) => this.chatsService.subChats()),
        tap((chats) => {
          this.chats = chats;
          this.loading = false;
        })
      )
      .subscribe();
  }

  selectedChat(chat: ChatModel) {
    this.navCtrl.navigateForward('/home/chats/' + chat._id);
  }
  async deleteChat(chat: ChatModel) {

    const loader = await this.loadCtrl.create({
      message: 'Eliminando',
    });
    loader.present();
    this.chatsService.deleteChatParticipant(chat._id).subscribe(
      () => {
        this.chats = this.chats.filter((x) => x._id !== chat._id);
        loader.dismiss();
      },
      (err) => loader.dismiss()
    );
  }
}
