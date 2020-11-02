import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-confirmation-modal',
  templateUrl: './confirmation-modal.component.html',
  styleUrls: ['./confirmation-modal.component.css'],
})
export class ConfirmationModalComponent implements OnInit {
  constructor(private authService: AuthService, private router: Router) {}
  token;
  isLoading = false;
  userNotFound = false;
  isAccountVerified = false;
  isAlreadyVerified = false;
  ngOnInit(): void {
    const url = this.router.url;
    const string2 = url.split('/');
    this.token = string2[string2.length - 1];
    this.isLoading = true;
    this.authService.confirmEmail(this.token).subscribe(
      (data) => {
        const res: any = data;
        res.isVerified === true ? this.isAccountVerified = true : this.isAccountVerified = false;
        this.isLoading = false;
      },
      (err) => {
        this.isLoading = false;
        err.error.type === 'user-not-found' ? this.userNotFound = true : this.userNotFound = false;
        err.error.type === 'already-verified' ? this.isAlreadyVerified = true : this.isAlreadyVerified = false;
      },
      () => {
        this.isLoading = false;
      }
    );
  }
}
