import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { environment } from 'src/environments/environment';
import { CredentialsModel } from '../models/credentials.model';
import { UserModel } from '../models/user.model';
import { switchMap, tap } from 'rxjs/operators';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Storage } from '@ionic/storage';
import { NavController, Platform } from '@ionic/angular';
import { ApiResponse } from '../models/apiResponse.model';
import { Router } from '@angular/router';

const TOKEN_KEY = 'access_token';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private currentUser: BehaviorSubject<UserModel> = new BehaviorSubject(null);

  constructor(
    private http: HttpClient,
    private storage: Storage,
    private helper: JwtHelperService,
    private plt: Platform,
    private nav: NavController
  ) {
    this.plt.ready().then(() => {
      this.checkToken();
    });
  }

  checkToken() {
    return this.storage.get(TOKEN_KEY).then((token) => {
      if (token) {
        const isExpired = this.helper.isTokenExpired(token);

        if (!isExpired) {
          return this.http
            .get<UserModel>(environment.API + '/auth')
            .pipe(tap((user) => this.setCurrentUser(user)))
            .subscribe();
        } else {
          this.storage.remove(TOKEN_KEY);
        }
      } else {
        this.nav.navigateRoot('/');
      }
    });
  }

  subUser() {
    return this.currentUser;
  }

  sendVerificationCode(phoneNumber: string) {
    return this.http.post<ApiResponse>(environment.API + '/auth/verify', {
      phoneNumber,
    });
  }

  registerUser(user: UserModel) {
    return this.http.post<UserModel>(environment.API + '/auth/register', user);
  }

  verifyCode(phoneNumber: string, code: string) {
    return this.http.post(environment.API + '/auth/verifyCode', {
      phoneNumber,
      verificationCode: code,
    });
  }

  loginUser(credentials: CredentialsModel) {
    return this.http
      .post<UserModel>(environment.API + '/auth/login', credentials)
      .pipe(
        tap((res) => {
          this.storage.set(TOKEN_KEY, res['token']);
          this.setCurrentUser(res['user']);
        })
      );
  }

  logoutUser() {
    this.storage.remove(TOKEN_KEY);
    this.nav.navigateRoot('/');
  }

  isLoggedIn() {
    return this.http
      .get<UserModel>(environment.API + '/auth')
      .pipe(tap((user) => this.setCurrentUser(user)));
  }

  setCurrentUser(user: UserModel) {
    this.currentUser.next(user);
  }
}
