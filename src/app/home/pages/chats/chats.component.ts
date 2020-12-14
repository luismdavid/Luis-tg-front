import { Component, OnInit } from '@angular/core';
import {
  ActionSheetController,
  ModalController,
} from '@ionic/angular';
import { filter, tap } from 'rxjs/operators';
import { UserModel } from 'src/app/models/user.model';
import { AuthService } from 'src/app/services/auth.service';
import { NewChatModalComponent } from './new-chat-modal/new-chat-modal.component';

@Component({
  selector: 'app-chats',
  templateUrl: './chats.component.html',
  styleUrls: ['./chats.component.scss'],
})
export class ChatsComponent implements OnInit {
  currentUser: UserModel;

  constructor(
    private authService: AuthService,
    private sheet: ActionSheetController,
    private modalCtrl: ModalController,
  ) {}

  ngOnInit() {
    this.authService
      .subUser()
      .pipe(
        filter((user) => !!user),
        tap((user) => (this.currentUser = user))
      )
      .subscribe();
  }


  createNewChat() {
    this.sheet
      .create({
        header: 'Tipo de chat',
        buttons: [
          {
            text: 'Grupo',
            icon: 'people-outline',
            handler: () => {
              this.showModal('group');
            },
          },
          {
            text: 'Privado',
            icon: 'person-outline',
            handler: () => {
              this.showModal('private');
            },
          },
        ],
      })
      .then((sheet) => sheet.present());
  }

  showModal(type: 'private' | 'group') {
    this.modalCtrl
      .create({
        component: NewChatModalComponent,
        componentProps: {
          type,
          currentUser: this.currentUser,
        },
      })
      .then((modal) => modal.present());
  }
}
