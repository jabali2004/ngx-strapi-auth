import { Inject, Injectable, Injector } from '@angular/core';
import {
  HttpEvent,
  HttpInterceptor,
  HttpHandler,
  HttpRequest,
  HttpErrorResponse
} from '@angular/common/http';
import { throwError, Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';
import { StrapiAuthConfig } from '../types/StrapiAuthConfig';
import { ConfigService } from '../services/config.service';
import { Router } from '@angular/router';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(
    private injector: Injector,
    private router: Router,
    @Inject(ConfigService) public strapiAuthConfig: StrapiAuthConfig
  ) {}

  private AUTH_HEADER = 'Authorization';

  private token;
  private authService: AuthService;

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    this.authService = this.injector.get(AuthService);
    this.token = this.authService.getToken();

    if (!req.headers.has('Content-Type')) {
      req = req.clone({
        headers: req.headers.set('Content-Type', 'application/json')
      });
    }

    req = this.addAuthenticationToken(req);

    return next.handle(req).pipe(
      catchError((error: HttpErrorResponse) => {
        switch (error.status) {
          // Intercept unauthorized request
          case 401:
            // Check if error response is caused by invalid token
            if (
              error.error.message === 'Invalid token.' &&
              error.error.error === 'Unauthorized'
            ) {
              return this.authService.logout().then(() => {
                this.router.navigateByUrl('/auth/login');
              });
            } else {
              return throwError(() => error);
            }

          case 403:
            return throwError(() => error);

          case 404:
            return throwError(() => error);

          default:
            return throwError(() => error);
        }
      })
    ) as Observable<HttpEvent<any>>;
  }

  private addAuthenticationToken(request: HttpRequest<any>): HttpRequest<any> {
    // If we do not have a token yet then we should not set the header.
    // Here we could first retrieve the token from where we store it.
    if (!this.token) {
      return request;
    }
    // If you are calling an outside domain then do not add the token.
    if (!request.url.match(this.strapiAuthConfig.strapi_base_url)) {
      return request;
    }

    return request.clone({
      headers: request.headers.set(this.AUTH_HEADER, 'Bearer ' + this.token)
    });
  }
}

// TODO: Add Token refresh and prettify
