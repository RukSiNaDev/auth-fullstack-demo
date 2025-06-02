import { Injectable } from '@angular/core';
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  Router
} from '@angular/router';
import { AuthService } from '../services/login.service';
import { SharedDataService } from '../services/shared-data.services';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService,
    private router: Router,
    private sharedDataService: SharedDataService) {

  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    const token = this.authService.getToken();
    const allowedRoles = route.data['roles'] as Array<string>;
    let userRole = this.authService.getUserRole() ?? '';
    console.log(token && userRole, 'AuthGuard canActivate');

    if (this.sharedDataService._isMock) {
      if (token && userRole) {
        return true;
      } else {
          this.router.navigate(['/login']);
          return false;
      }

    } else {

      if (!token || this.authService.isTokenExpired()) {
        this.router.navigate(['/login']);
        return false;
      }

      if (allowedRoles && !allowedRoles.includes(userRole)) {
        alert("คุณไม่มีสิทธิ์เข้าหน้านี้");
        this.router.navigate(['/welcome']);
        return false;
      }

      return true;
    }


  }
}