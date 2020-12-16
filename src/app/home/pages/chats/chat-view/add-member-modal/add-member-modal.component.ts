import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { distinctUntilChanged } from 'rxjs/operators';
import { UserModel } from 'src/app/models/user.model';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-add-member-modal',
  templateUrl: './add-member-modal.component.html',
  styleUrls: ['./add-member-modal.component.scss'],
})
export class AddMemberModalComponent implements OnInit {
  newMembers: UserModel[] = [];
  users: UserModel[] = [];
  searchBarValue: string = '';
  searching: boolean = false;
  @Input() currentUser: UserModel;
  @Input() currentMembers: UserModel[];

  constructor(
    private modalCtrl: ModalController,
    private usersService: UserService
  ) {}

  ngOnInit() {}

  close() {
    this.modalCtrl.dismiss(null, null, 'add-member-modal');
  }

  selectedUser(user: UserModel) {
    this.newMembers.push(user);
    this.searchBarValue = '';
  }

  saveNewMembers() {
    this.modalCtrl.dismiss(this.newMembers, null, 'add-member-modal');
  }

  removeMember(userId: string) {
    this.newMembers = this.newMembers.filter((x) => x._id !== userId);
  }

  searchUsers(event) {
    this.searching = true;
    this.usersService
      .searchUsers(event.target.value)
      .subscribe((users) => {
        this.users = users.filter(
          (x) =>
            x._id !== this.currentUser._id &&
            !this.currentMembers.find((a) => a._id === x._id) &&
            !this.newMembers.find((a) => a._id === x._id)
        );
        this.searching = false;
      });
  }

}
