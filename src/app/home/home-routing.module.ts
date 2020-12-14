import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomePage } from './home.page';
import { ChatListComponent } from './pages/chats/chat-list/chat-list.component';
import { ChatsComponent } from './pages/chats/chats.component';
import { ProfileComponent } from './pages/profile/profile.component';

const routes: Routes = [
  {
    path: '',
    component: HomePage,
    children: [
      {
        path: 'chats',
        component: ChatsComponent,
        children: [
          {
            path: '',
            pathMatch: 'full',
            component: ChatListComponent
          },
          {
            path: ':id',
            loadChildren: () =>
              import('./pages/chats/chat-view/chat-view.module').then((m) => m.ChatViewPageModule),
          },
        ],
      },
      {
        path: 'profile',
        component: ProfileComponent,
      },
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'chats'
      }
    ],
  },
  {
    path: 'chat-view',
    loadChildren: () =>
      import('./pages/chats/chat-view/chat-view.module').then(
        (m) => m.ChatViewPageModule
      ),
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class HomePageRoutingModule {}
