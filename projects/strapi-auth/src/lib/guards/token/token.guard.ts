import { Injectable } from '@angular/core';
import type {
  CanActivate,
  CanActivateChild,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  UrlTree,
  Router
} from '@angular/router';
import type { Observable } from 'rxjs';
import type { AuthService } from '../../services/auth/auth.service';
import type { StrapiAuthProviders } from '../../types/StrapiAuthConfig';

@Injectable({
  providedIn: 'root'
})
export class TokenGuard implements CanActivate, CanActivateChild {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ):
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    return this.checkUrlToken(route);
  }
  canActivateChild(
    childRoute: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ):
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    return this.checkUrlToken(childRoute);
  }

  /*
   * Checks Token in URL
   */
  checkUrlToken(route: ActivatedRouteSnapshot): boolean {
    const url = window.location.href;

    if (!this.authService.isAuthenticated && url.includes('?')) {
      const paramsUrl = window.location.href.split('?').pop();

      if (paramsUrl.length) {
        this.authService
          .callbackProviderLogin(
            paramsUrl,
            route.routeConfig.path as StrapiAuthProviders
          )
          .then(() => {
            this.router.navigateByUrl(this.authService.LoginRedirectUrl);
          });
      }
    }

    return true;
  }
}
