import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ChatViewPageRoutingModule } from './chat-view-routing.module';

import { ChatViewPage } from './chat-view.page';
import {
  NbCardModule,
  NbChatModule,
  NbLayoutModule,
  NbSearchModule,
  NbSidebarModule,
  NbSpinnerModule,
  NbThemeModule,
  NbUserModule,
} from '@nebular/theme';
import { NbEvaIconsModule } from '@nebular/eva-icons';
import { CastPipe } from 'src/app/pipes/cast.pipe';
import { ComponentsModule } from 'src/app/components/components.module';
import { OptionsListComponent } from './options-list/options-list.component';

const nbModules = [
  NbSidebarModule,
  NbLayoutModule,
  NbSearchModule,
  NbCardModule,
  NbUserModule,
  NbEvaIconsModule,
  NbSpinnerModule,
];

@NgModule({
  imports: [
    ComponentsModule,
    CommonModule,
    FormsModule,
    IonicModule,
    ChatViewPageRoutingModule,
    NbChatModule,
    NbThemeModule.forRoot({ name: 'dark' }),
    ...nbModules
  ],
  declarations: [ChatViewPage, OptionsListComponent, CastPipe],
})
export class ChatViewPageModule {}
