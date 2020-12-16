import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { IonSlides, LoadingController, ModalController } from '@ionic/angular';
import { of } from 'rxjs';
import { catchError, switchMap, tap } from 'rxjs/operators';
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
  participants: UserModel[] = [];
  searchBarValue = '';
  imageAuxiliar: File | Blob;
  groupName: string = '';
  activeSlideIndex: number = 0;
  @Input() type: 'private' | 'group' | 'channel';
  @Input() currentUser: UserModel;
  @ViewChild('slide') slides: IonSlides;

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
      this.users = users.filter(
        (x) =>
          x._id !== this.currentUser._id &&
          !this.participants.find((a) => a._id === x._id)
      );
      this.searching = false;
    });
  }

  close() {
    this.modalCtrl.dismiss();
  }

  async onSlideChange(event) {
    this.activeSlideIndex = await this.slides.getActiveIndex();
  }

  selectedUser(user: UserModel) {
    if (this.type === 'private') {
      const newChat: ChatModel = {
        type: this.type,
        messages: [],
        admins: [],
        participants: [this.currentUser._id, user._id],
        title: `${user.name} - ${this.currentUser.name}`,
      };

      this.createChat(newChat);
    } else {
      this.searchBarValue = '';
      this.users = this.users.filter((x) => x._id !== user._id);
      this.participants.push(user);
    }
  }

  async createGroup() {
    const loader = await this.loadingCtrl.create({
      message: 'Subiendo imagen...',
    });
    loader.present();

    this.chatsService
      .uploadMessageImage(this.imageAuxiliar)
      .pipe(
        tap(({ url }) => {
          loader.dismiss();
          const newChat: ChatModel = {
            type: this.type,
            messages: [],
            admins: [this.currentUser._id],
            participants: [
              ...this.participants.map((x) => x._id),
              this.currentUser._id,
            ],
            title: this.groupName,
            image: url,
          };
          this.createChat(newChat);
        }),
        catchError((err) => {
          loader.dismiss();
          console.log(err);
          return of(err);
        })
      )
      .subscribe();
  }

  async createChat(chat: ChatModel) {
    const loader = await this.loadingCtrl.create({
      message: 'Creando...',
    });
    loader.present();

    this.chatsService.createNewChat(chat).subscribe(
      () => {
        console.log('chat creado');
        loader.dismiss();
        this.modalCtrl.dismiss();
      },
      (err) => {
        loader.dismiss();
        console.log(err);
      }
    );
  }

  removeParticipant(userId: string) {
    this.participants = this.participants.filter((x) => x._id !== userId);
  }
}
