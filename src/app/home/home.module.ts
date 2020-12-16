import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HomePage } from './home.page';

import { HomePageRoutingModule } from './home-routing.module';
import { ProfileComponent } from './pages/profile/profile.component';
import { ChatsComponent } from './pages/chats/chats.component';
import { ComponentsModule } from '../components/components.module';
import { CodePopoverComponent } from './pages/profile/code-popover/code-popover.component';
import { ChatPreviewComponent } from './pages/chats/chat-preview/chat-preview.component';
import { NewChatModalComponent } from './pages/chats/new-chat-modal/new-chat-modal.component';
import { UserItemComponent } from './pages/chats/user-item/user-item.component';
import { ChatListComponent } from './pages/chats/chat-list/chat-list.component';
import { CastPipe } from '../pipes/cast.pipe';
import { EditChatModalComponent } from './pages/chats/chat-view/edit-chat-modal/edit-chat-modal.component';
import { AddMemberModalComponent } from './pages/chats/chat-view/add-member-modal/add-member-modal.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    HomePageRoutingModule,
    ReactiveFormsModule,
    ComponentsModule,
  ],
  declarations: [
    HomePage,
    ProfileComponent,
    ChatsComponent,
    CodePopoverComponent,
    ChatPreviewComponent,
    NewChatModalComponent,
    UserItemComponent,
    EditChatModalComponent,
    ChatListComponent,
    AddMemberModalComponent
  ],
})
export class HomePageModule {}
