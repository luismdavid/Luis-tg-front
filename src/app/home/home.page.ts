import { Component } from '@angular/core';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  menuItems = [
    {
      icon: 'mail',
      label: 'Chats',
      route: '/home/chats',
    },
    {
      icon: 'person-circle-outline',
      label: 'Perfil',
      route: '/home/profile',
    },
  ];

  constructor(public authService: AuthService) {}

  logout() {
    this.authService.logoutUser();
  }

}
