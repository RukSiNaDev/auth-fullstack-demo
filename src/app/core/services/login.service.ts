import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { SharedDataService } from '../services/shared-data.services';

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
        this.http.get('assets/users.json').subscribe(users => {
          console.log("users : ", users);
          const userArray = users as any[];
          if (!credentials.email || !credentials.password) {
            observer.error({ status: 400, error: 'Email and password are required.' });
            return;
          }
          const user = userArray.find((u: any) => u.email === credentials.email && u.password === credentials.password);
          if (user) {
            const tokenPayload = {
              email: user.email,
              role: user.role,
              name: user.fullName,
              exp: Date.now() + 1000 * 60 * 60 * 24 * 30 // 30 วัน
            };
            const token = btoa(JSON.stringify(tokenPayload));
            // this.saveToken(token);
            observer.next({ token });
            observer.complete();
          } else {
            observer.error({ status: 401, error: 'Wrong credentials' });
          }
        }, error => {
          observer.error(error);
        });
      });

    } else {
      return this.http.post(`${this.apiUrl + 'login'}`, credentials);
    }

  }

  register(registerObj: any) {
    return this.http.post(`${this.apiUrl + 'createNewUser'}`, registerObj);
  }

  isTokenExpired(): boolean {
    const token = localStorage.getItem('token');
    if (!token) return true;
    try {
      const payload = JSON.parse(atob(token));
      if (!payload.exp) return true;
      return Date.now() > payload.exp;
    } catch (e) {
      // If decoding fails, treat token as expired
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
      console.log("decoded : ", decoded)

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
