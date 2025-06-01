import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { SharedDataService } from './shared-data.services';

@Injectable({
  providedIn: 'root'
})


export class AuthService {
  private apiUrl = 'https://localhost:7050/api/User/';

  constructor(private http: HttpClient,
    private sharedDataService: SharedDataService
  ) {

  }

  login(credentials: any): Observable<any> {
    if (this.sharedDataService._isMock) {
      return new Observable(observer => {
        const storedUsers = localStorage.getItem('mockUsers');
        const userArray = storedUsers ? JSON.parse(storedUsers) : [];

        if (!credentials.email || !credentials.password) {
          observer.error({ status: 400, error: 'Email and password are required.' });
          return;
        }

        const user = userArray.find((u: any) =>
          u.email === credentials.email && u.password === credentials.password
        );

        if (user) {
          const tokenPayload = {
            email: user.email,
            role: user.role,
            name: user.fullName,
            exp: Date.now() + 1000 * 60 * 60 * 24 * 30
          };
          const token = btoa(JSON.stringify(tokenPayload));
          observer.next({ token });
          observer.complete();
        } else {
          observer.error({ status: 401, error: 'Wrong credentials' });
        }
      });

    } else {
      return this.http.post(`${this.apiUrl + 'login'}`, credentials);
    }

  }

  register(registerObj: any) {
    if (this.sharedDataService._isMock) {
      const users = JSON.parse(localStorage.getItem('mockUsers') || '[]');

      const exists = users.find((u: any) => u.email === registerObj.email);
      if (exists) {
        return throwError(() => new Error('Email already registered'));
      }

      registerObj.createDate = new Date().toISOString();
      users.push(registerObj);
      localStorage.setItem('mockUsers', JSON.stringify(users));

      return of({ message: 'Registered successfully (mock)' });
    } else {
      return this.http.post(`${this.apiUrl + 'createNewUser'}`, registerObj);
    }
  }

  resetPassword(newPasswordObj: any) {

    if (this.sharedDataService._isMock) {
      const users = JSON.parse(localStorage.getItem('mockUsers') || '[]');
      const index = users.findIndex((u: any) => u.email === newPasswordObj.email);

      if (index === -1) {
        return throwError(() => new Error('User with this email does not exist (mock)'));
      }

      // เปลี่ยนรหัสผ่านใหม่ (mock) – ในที่นี้อาจจะไม่ hash จริง
      users[index].password = newPasswordObj.newPassword;
      localStorage.setItem('mockUsers', JSON.stringify(users));

      return of({ message: 'Password reset successfully (mock)' });
    } else {
      return this.http.post(`${this.apiUrl + 'resetPassword'}`, newPasswordObj);
    }
  }

  isTokenExpired(): boolean {
    const token = this.getToken();
    if (!token) return true;

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const exp = payload.exp;
      if (!exp) return true;

      const now = Math.floor(Date.now() / 1000);
      return exp < now;
    } catch (e) {
      console.error("Token decode error", e);
      return true;
    }
  }

  getUserRole(): string | null {
    const token = localStorage.getItem('token');
    if (this.sharedDataService._isMock) {
      if (!token) return null;
      try {
        const payload = JSON.parse(atob(token));
        return payload.role || null;
      } catch (e) {
        return null;
      }
    } else {
      if (!token) return null;
      const decoded = JSON.parse(atob(token.split('.')[1]));
      return decoded['role'] || null;
    }
  }

  saveToken(token: string) {
    localStorage.setItem('token', token);
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  logout() {
    localStorage.removeItem('token');
  }


}
