import { Component, Input, OnInit } from '@angular/core';
import { PopoverController } from '@ionic/angular';
import { AuthService } from 'src/app/services/auth.service';
import { ToastService } from 'src/app/services/toast.service';

@Component({
  selector: 'app-code-popover',
  templateUrl: './code-popover.component.html',
  styleUrls: ['./code-popover.component.scss'],
})
export class CodePopoverComponent implements OnInit {
  verificationCode: string = '';
  loading: boolean = false;
  @Input() onSuccessfulVerify: () => void;
  @Input() phoneNumber: string;

  constructor(
    private authService: AuthService,
    private popover: PopoverController,
    private toast: ToastService
  ) {}

  ngOnInit() {}

  verifyCode() {
    this.authService
      .verifyCode(this.phoneNumber, this.verificationCode)
      .subscribe(
        () => {
          this.onSuccessfulVerify();
          this.popover.dismiss();
          this.loading = false;
        },
        ({ error }) => {
          this.toast.show(error.message);
          this.loading = false;
        }
      );
  }
}
