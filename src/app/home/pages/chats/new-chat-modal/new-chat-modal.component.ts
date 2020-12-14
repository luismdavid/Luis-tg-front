import { Component, Input, OnInit } from '@angular/core';
import { LoadingController, ModalController } from '@ionic/angular';
import { ChatModel } from 'src/app/models/chat.model';
import { UserModel } from 'src/app/models/user.model';
import { ChatService } from 'src/app/services/chat.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-new-chat-modal',
  templateUrl: './new-chat-modal.component.html',
  styleUrls: ['./new-chat-modal.component.scss'],
})
export class NewChatModalComponent implements OnInit {
  users: UserModel[] = [];
  searching: boolean = false;
  @Input() type: 'private' | 'group';
  @Input() currentUser: UserModel;

  constructor(
    private modalCtrl: ModalController,
    private usersService: UserService,
    private chatsService: ChatService,
    private loadingCtrl: LoadingController
  ) {}

  ngOnInit() {}

  searchUsers(event) {
    this.searching = true;
    this.usersService.searchUsers(event.target.value).subscribe((users) => {
      this.users = users;
      this.searching = false;
    });
  }

  close() {
    this.modalCtrl.dismiss();
  }

  async selectedUser(user: UserModel) {
    if (this.type === 'private') {
      const newChat: ChatModel = {
        isPrivate: true,
        messages: [],
        participants: [this.currentUser._id, user._id],
        title: `${user.name} - ${this.currentUser.name}`,
      };
      const loader = await this.loadingCtrl.create({
        message: 'Creando...',
      });
      loader.present();

      this.chatsService.createNewChat(newChat).subscribe(() => {
        console.log('chat creado');
        loader.dismiss();
        this.modalCtrl.dismiss();
      });
    } else {
    }
  }
}
