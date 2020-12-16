import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
import { ChatModel } from 'src/app/models/chat.model';
import { MessageModel } from 'src/app/models/message.model';
import { UserModel } from 'src/app/models/user.model';

@Component({
  selector: 'app-chat-preview',
  templateUrl: './chat-preview.component.html',
  styleUrls: ['./chat-preview.component.scss'],
})
export class ChatPreviewComponent implements OnInit, OnChanges {
  @Input() public chat: ChatModel;
  @Input() private currentUser: UserModel;
  @Output() onSelected = new EventEmitter();
  @Output() onDelete = new EventEmitter<ChatModel>();
  public mostRecentMsg: MessageModel;
  public chatImage = '';

  constructor() {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['chat']) {
      this.mostRecentMsg = (this.chat.messages as MessageModel[]).sort((a, b) => {
        return (b.sentDate as Date).getTime() - (a.sentDate as Date).getTime();
      })[0];
    }
  }

  ngOnInit() {
    if (this.chat.type === 'private') {
      const other = (this.chat.participants as UserModel[]).find(
        (x) => x._id !== this.currentUser._id
      );
      this.chatImage = other ? other.profileImg : this.currentUser.profileImg;
    } else {
      this.chatImage = this.chat.image;
    }
  }

 
}
