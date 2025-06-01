import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/login.service';

@Component({
  selector: 'app-login',
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})


export class LoginComponent {

  showLogin = true;
  showPassword = false;
  registerObj: any = {
    email: "",
    password: "",
    createDate: new Date(),
    fullName: "",
    mobileNo: "",
    role: "user"
  }

  loginObj: any = {
    email: "",
    password: ""
  }

  passwordErrors = {
    minLength: true,
    hasLetter: true,
    hasNumber: true
  };

  router = inject(Router)
  service = inject(AuthService)

  constructor(
    private authService: AuthService,
  ) {

  }

  ngOnInit(): void {
    const token = this.service.getToken();
    const isExpired = this.service.isTokenExpired();

    if (token && !isExpired) {
      const role = this.service.getUserRole();
      if (role === 'admin') {
        this.router.navigateByUrl('/user-list');
      } else {
        this.router.navigateByUrl('/welcome');
      }
    }
  }

  validatePassword() {
    const password = this.registerObj.password || '';

    this.passwordErrors = {
      minLength: password.length < 8,
      hasLetter: !/[a-zA-Z]/.test(password),
      hasNumber: !/\d/.test(password)
    };
  }

  gotoLogin() {
    this.showLogin = true;
  }

  gotoRegister() {
    this.showLogin = false;
  }

  onLogin() {
    this.authService.login(this.loginObj).subscribe({
      next: (res: any) => {

        const token = res.token;
        this.service.saveToken(token);
        let roleUser = this.service.getUserRole();
        alert("Login Success!");

        if (roleUser === "admin") {
          this.router.navigateByUrl('/user-list');
        } else {
          this.router.navigateByUrl('/welcome');
        }
      },
      error: error => {
        if (error.status === 400) {
          alert("Invalid Body");
        } else if (error.status === 401) {
          alert("Wrong Credentials");
        } else if (error.status === 500) {
          alert(error.error);
        }
      }
    });
  }

  onRegister() {
    this.authService.register(this.registerObj).subscribe({
      next: (res: any) => {
        this.gotoLogin()
      },
      error: error => {
        if (error.status == 400) {
          alert("Invalid Body")
        } else if (error.status == 500) {
          alert(error.error)
        }
      }
    });
  }

  gotoResetPassword() {
    this.router.navigateByUrl('/reset-password');
  }
}
