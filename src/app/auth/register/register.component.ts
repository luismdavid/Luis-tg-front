import { Component, OnInit, ViewChild } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { NavController } from '@ionic/angular';
import { distinctUntilChanged, switchMap, tap } from 'rxjs/operators';
import { AuthService } from 'src/app/services/auth.service';
import { ToastService } from 'src/app/services/toast.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent implements OnInit {
  form: FormGroup;
  loading: boolean = false;

  constructor(
    private fb: FormBuilder,
    private auth: AuthService,
    private toast: ToastService,
    private nav: NavController
  ) {}

  ngOnInit() {
    this.form = this.fb.group({
      email: new FormControl('', [Validators.email, Validators.required]),
      name: new FormControl('', [
        Validators.maxLength(30),
        Validators.required,
      ]),
      phoneNumber: new FormControl('', [
        Validators.minLength(3),
        Validators.maxLength(30),
        Validators.required,
      ]),
      password: new FormControl('', [
        Validators.maxLength(20),
        Validators.required,
      ]),
    });

    this.form
      .get('phoneNumber')
      .valueChanges.pipe(
        distinctUntilChanged(),
        tap((value) =>
          this.form.get('phoneNumber').setValue(this.removeWhitespaces(value))
        )
      )
      .subscribe();
  }

  removeWhitespaces(string: string) {
    return string.replace(' ', '');
  }

  sendVerificationCode() {
    this.loading = true;
    this.auth.sendVerificationCode(this.form.value.phoneNumber).subscribe(
      (res) => {
        this.loading = false;
        this.form.addControl(
          'verificationCode',
          new FormControl('', [
            Validators.minLength(6),
            Validators.maxLength(6),
            Validators.required,
          ])
        );
        this.toast.show(
          'Se ha enviado un codigo de verificacion a su telefono.'
        );
      },
      ({ error }) => {
        this.loading = false;
        this.toast.show(error.message);
      }
    );
  }

  changedPhone(obj) {}

  createUser() {
    if (!this.form.get('verificationCode')) {
      return this.sendVerificationCode();
    }
    this.auth
      .verifyCode(this.form.value.phoneNumber, this.form.value.verificationCode)
      .pipe(switchMap(() => this.auth.registerUser(this.form.value)))
      .subscribe(
        () => {
          this.loading = true;
          this.nav.navigateRoot('/auth/login');
        },
        ({ error }) => {
          this.toast.show(error.message);
          this.loading = false;
        }
      );
  }
}
