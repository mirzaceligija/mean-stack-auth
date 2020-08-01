import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../authentication/auth.service';

@Injectable({
  providedIn: 'root'
})
export class NoAuthGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
    ): boolean | import('@angular/router').UrlTree | Observable < boolean |
    import('@angular/router').UrlTree> | Promise<boolean | import('@angular/router').UrlTree> {
      const isAuth = this.authService.getIsAuth();
      if (isAuth) {
        this.router.navigate(['/']);
      }
      return !isAuth;
  }
  
}
