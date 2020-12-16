import { Component, Input, OnInit } from '@angular/core';
import {
  LoadingController,
  ModalController,
  PopoverController,
} from '@ionic/angular';
import { pipe } from 'rxjs';
import { switchMap, tap } from 'rxjs/operators';
import { ChatModel } from 'src/app/models/chat.model';
import { MessageModel } from 'src/app/models/message.model';
import { UserModel } from 'src/app/models/user.model';
import { ChatService } from 'src/app/services/chat.service';
import { ToastService } from 'src/app/services/toast.service';
import { AddMemberModalComponent } from '../add-member-modal/add-member-modal.component';
import { OptionsListComponent } from '../options-list/options-list.component';

@Component({
  selector: 'app-edit-chat-modal',
  templateUrl: './edit-chat-modal.component.html',
  styleUrls: ['./edit-chat-modal.component.scss'],
})
export class EditChatModalComponent implements OnInit {
  @Input() currentChat: ChatModel;
  @Input() currentUser: UserModel;

  constructor(
    private modalCtrl: ModalController,
    private popoverCtrl: PopoverController,
    private chatsService: ChatService,
    private loadingCtrl: LoadingController,
    private toast: ToastService
  ) {}

  ngOnInit() {}

  close() {
    this.modalCtrl.dismiss(this.currentChat);
  }

  async uploadImage(image: File | Blob) {
    const loader = await this.loadingCtrl.create({
      message: 'Subiendo imagen...',
    });
    loader.present();
    this.chatsService
      .uploadMessageImage(image)
      .pipe(
        switchMap(({ url }) => {
          const chat: ChatModel = {
            ...this.currentChat,
            image: url,
            messages: (this.currentChat.messages as MessageModel[]).map(
              (x) => x._id
            ),
            admins: (this.currentChat.admins as UserModel[]).map((x) => x._id),
            participants: (this.currentChat.participants as UserModel[]).map(
              (x) => x._id
            ),
          };
          return this.chatsService.updateChat(chat);
        })
      )
      .subscribe(
        () => {
          this.toast.show('La imagen ha sido actualizada con exito.');
          loader.dismiss();
        },
        (err) => {
          this.toast.show(err);
          loader.dismiss();
        }
      );
  }

  async saveChanges() {
    const loader = await this.loadingCtrl.create({
      message: 'Actualizando...',
    });
    loader.present();
    const chat: ChatModel = {
      ...this.currentChat,
      messages: (this.currentChat.messages as MessageModel[]).map((x) => x._id),
      admins: (this.currentChat.admins as UserModel[]).map((x) => x._id),
      participants: (this.currentChat.participants as UserModel[]).map(
        (x) => x._id
      ),
    };
    this.chatsService.updateChat(chat).subscribe(
      (updated) => {
        this.currentChat = updated;
        loader.dismiss();
        this.close();
      },
      (err) => {
        this.toast.show(err);
        loader.dismiss();
      }
    );
  }

  openUserOptions(ev, user: UserModel, admin = false) {
    this.popoverCtrl
      .create({
        component: OptionsListComponent,
        componentProps: {
          options: [
            {
              icon: 'trash-outline',
              label: 'Eliminar',
              action: async () => {
                const loader = await this.loadingCtrl.create({
                  message: 'Eliminando...',
                });
                loader.present();

                this.currentChat.admins = (this.currentChat
                  .admins as UserModel[]).filter((x) => x._id !== user._id);
                if (!admin) {
                  this.currentChat.participants = (this.currentChat
                    .participants as UserModel[]).filter(
                    (x) => x._id !== user._id
                  );
                }
                const chat: ChatModel = {
                  ...this.currentChat,
                  messages: (this.currentChat.messages as MessageModel[]).map(
                    (x) => x._id
                  ),
                  admins: (this.currentChat.admins as UserModel[]).map(
                    (x) => x._id
                  ),
                  participants: (this.currentChat
                    .participants as UserModel[]).map((x) => x._id),
                };
                this.chatsService
                  .updateChat(chat)
                  .pipe(
                    tap((updated) => (this.currentChat = updated)),
                    switchMap(() =>
                      this.chatsService.sendMessage(this.currentChat._id, {
                        sender: user._id,
                        content: admin
                          ? `${user.name} Ha dejado de ser administrador.`
                          : `${user.name} Ha salido del chat.`,
                        sentDate: new Date(),
                        type: 'text',
                      })
                    )
                  )
                  .subscribe(
                    () => {
                      this.popoverCtrl.dismiss();
                      loader.dismiss();
                    },
                    (err) => {
                      this.toast.show(err);
                      this.popoverCtrl.dismiss();
                      loader.dismiss();
                    }
                  );
              },
            },
          ],
        },
        event: ev,
      })
      .then((popover) => popover.present());
  }

  async addAdmins() {
    const modal = await this.modalCtrl.create({
      component: AddMemberModalComponent,
      componentProps: {
        currentUser: this.currentUser,
        currentMembers: this.currentChat.admins,
      },
      id: 'add-member-modal',
    });

    modal.present();

    const { data } = await modal.onWillDismiss();

    if (!data) return;
    const loader = await this.loadingCtrl.create({
      message: 'Actualizando...',
    });
    loader.present();

    data.forEach((adm) => {
      if (
        !(this.currentChat.participants as UserModel[]).find(
          (x) => x._id === adm._id
        )
      )
        this.currentChat.participants.push(adm);
    });
    this.currentChat.admins = (this.currentChat.admins as UserModel[]).concat(
      data
    );

    const chat: ChatModel = {
      ...this.currentChat,
      messages: (this.currentChat.messages as MessageModel[]).map((x) => x._id),
      admins: (this.currentChat.admins as UserModel[]).map((x) => x._id),
      participants: (this.currentChat.participants as UserModel[]).map(
        (x) => x._id
      ),
    };

    this.chatsService.updateChat(chat).subscribe(
      (updated) => {
        this.currentChat = updated;
        loader.dismiss();
        this.toast.show('Administradores anadidos.');
      },
      (err) => {
        this.toast.show(err);
        loader.dismiss();
      }
    );
  }

  async addMembers() {
    const modal = await this.modalCtrl.create({
      component: AddMemberModalComponent,
      componentProps: {
        currentUser: this.currentUser,
        currentMembers: this.currentChat.participants,
      },
      id: 'add-member-modal',
    });

    modal.present();

    const { data } = await modal.onWillDismiss();

    if (!data) return;
    const loader = await this.loadingCtrl.create({
      message: 'Actualizando...',
    });
    loader.present();
    const chat: ChatModel = {
      ...this.currentChat,
      messages: (this.currentChat.messages as MessageModel[]).map((x) => x._id),
      admins: (this.currentChat.admins as UserModel[]).map((x) => x._id),
      participants: [
        ...(this.currentChat.participants as UserModel[]),
        ...data,
      ].map((x) => x._id),
    };

    this.chatsService.updateChat(chat).subscribe(
      (updated) => {
        this.currentChat = updated;
        loader.dismiss();
        this.toast.show('Miembros anadidos.');
      },
      (err) => {
        this.toast.show(err);
        loader.dismiss();
      }
    );
  }
}
