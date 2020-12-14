import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { PopoverController } from '@ionic/angular';
import { pipe } from 'rxjs';
import { filter, tap } from 'rxjs/operators';
import { UserModel } from 'src/app/models/user.model';
import { AuthService } from 'src/app/services/auth.service';
import { ToastService } from 'src/app/services/toast.service';
import { UserService } from 'src/app/services/user.service';
import { CodePopoverComponent } from './code-popover/code-popover.component';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
})
export class ProfileComponent implements OnInit {
  currentUser: UserModel;
  form: FormGroup;
  loading: boolean = false;
  constructor(
    private authService: AuthService,
    private userService: UserService,
    private toast: ToastService,
    private fb: FormBuilder,
    private popover: PopoverController
  ) {}

  ngOnInit() {
    this.subCurrentUser();
  }

  subCurrentUser() {
    this.authService
      .subUser()
      .pipe(filter((user) => !!user))
      .subscribe((user) => {
        this.currentUser = user;
        this.createForm();
      });
  }

  createForm() {
    this.form = this.fb.group({
      name: new FormControl(this.currentUser.name, [
        Validators.maxLength(100),
        Validators.required,
      ]),
      email: new FormControl(this.currentUser.email, [
        Validators.email,
        Validators.maxLength(100),
        Validators.required,
      ]),
      phoneNumber: new FormControl(this.currentUser.phoneNumber, [
        Validators.required,
        Validators.maxLength(100),
      ]),
    });
  }

  validateChanged() {
    let changed = false;
    for (const key in this.currentUser) {
      const element = this.currentUser[key];
      if (this.form.value[key] && element !== this.form.value[key]) {
        changed = true;
        break;
      }
    }
    return changed;
  }

  uploadProfileImage(image: File | Blob) {
    this.userService.uploadProfileImage(image).subscribe(() => {
      this.toast.show('La imagen ha sido actualizada con exito.');
    });
  }

  saveChanges() {
    this.loading = true;
    const updateOp = this.userService
      .updateUser({
        ...this.currentUser,
        ...this.form.value,
      })
      .pipe(
        tap(() => {
          this.loading = false;
          this.toast.show('El usuario ha sido actualizado con exito.');
        })
      );
    if (this.currentUser.phoneNumber !== this.form.value.phoneNumber) {
      this.authService
        .sendVerificationCode(this.form.value.phoneNumber)
        .subscribe(() => {
          this.loading = false;
          this.popover
            .create({
              component: CodePopoverComponent,
              backdropDismiss: false,
              componentProps: {
                phoneNumber: this.form.value.phoneNumber,
                onSuccessfulVerify: () => {
                  this.loading = true;
                  updateOp.subscribe();
                },
              },
            })
            .then((pop) => pop.present());
        });
    } else {
      updateOp.subscribe();
    }
  }
}
