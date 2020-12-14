import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { tap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { UserModel } from '../models/user.model';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  constructor(private http: HttpClient, private authService: AuthService) {}

  uploadProfileImage(image: Blob) {
    const fd = new FormData();
    fd.append('file', image);
    return this.http.post(environment.API + '/auth/users/uploadProfileImg', fd);
  }

  updateUser(user: UserModel) {
    return this.http
      .put<UserModel>(environment.API + '/auth/users', user)
      .pipe(tap((res) => this.authService.setCurrentUser(res)));
  }

  searchUsers(term: string) {
    return this.http.get<UserModel[]>(
      environment.API + '/auth/users?term=' + term
    );
  }
}
