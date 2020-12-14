import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { NavController } from '@ionic/angular';
import { AuthService } from 'src/app/services/auth.service';
import { ToastService } from 'src/app/services/toast.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  form: FormGroup;
  loading: boolean = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private nav: NavController,
    private toast: ToastService
  ) {}

  ngOnInit() {
    this.form = this.fb.group({
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [
        Validators.required,
        Validators.maxLength(20),
      ]),
    });
  }

  loginUser() {
    this.loading = true;
    this.authService.loginUser(this.form.value).subscribe(
      () => {
        this.loading = false;
        this.nav.navigateRoot('/home');
      },
      error => {
        console.log(error)
        this.loading = false;
        this.toast.show(JSON.stringify(error))
      }
    );
  }
}
