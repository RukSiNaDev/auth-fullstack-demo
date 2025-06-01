import { Component, inject } from '@angular/core';
import { AuthService } from '../../core/services/login.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-reset-password',
  imports: [CommonModule, FormsModule],
  templateUrl: './reset-password.component.html',
  styleUrl: './reset-password.component.css'
})
export class ResetPasswordComponent {
  obj: any = {
    email: "",
    newPassword: "",
    newPasswordConfirm: ""
  }
  passwordErrors = {
    minLength: true,
    hasLetter: true,
    hasNumber: true,
    isNotMatching: true
  };
  showPassword = false;
  showConfirmPassword = false;

  router = inject(Router)

  constructor(
    private authService: AuthService,
  ) {

  }

  validatePassword() {
    const password = this.obj.newPassword || '';

    this.passwordErrors = {
      minLength: password.length < 8,
      hasLetter: !/[a-zA-Z]/.test(password),
      hasNumber: !/\d/.test(password),
      isNotMatching: (this.obj.newPassword || '') !== (this.obj.newPasswordConfirm || '')
    };
  }

  onResetPassword() {
    if (this.passwordErrors.minLength || this.passwordErrors.hasLetter || this.passwordErrors.hasNumber || this.passwordErrors.isNotMatching) {
      alert("Please fix the password errors before resetting.");
      return;
    }
    this.authService.resetPassword({ email: this.obj.email, newPassword: this.obj.newPassword }).subscribe({
      next: res => {
        alert("Password reset successful");
        this.router.navigateByUrl('/login');
      },
      error: err => {
        alert(err.error.message);
      }
    });
  }
}
