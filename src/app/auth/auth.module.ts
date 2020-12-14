import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AuthPageRoutingModule } from './auth-routing.module';

import { AuthPage } from './auth.page';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { InternationalPhoneNumberModule } from 'ngx-international-phone-number';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    InternationalPhoneNumberModule,
    IonicModule,
    AuthPageRoutingModule
  ],
  declarations: [AuthPage, LoginComponent, RegisterComponent]
})
export class AuthPageModule {}
