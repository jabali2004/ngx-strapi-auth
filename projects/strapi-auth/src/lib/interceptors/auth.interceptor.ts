import { Injectable, Injector } from '@angular/core';
import {
  HttpEvent,
  HttpInterceptor,
  HttpHandler,
  HttpRequest,
  HttpErrorResponse
} from '@angular/common/http';
import { throwError, Observable, BehaviorSubject, of } from 'rxjs';
import { catchError, filter, take, switchMap } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private injector: Injector) {}

  private AUTH_HEADER = 'Authorization';
  private token;
  private refreshTokenInProgress = false;
  private refreshTokenSubject: BehaviorSubject<any> = new BehaviorSubject<any>(
    null
  );
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
        // if (error && error.status === 401) {
        //   // 401 errors are most likely going to be because we have an expired token that we need to refresh.
        //   if (this.refreshTokenInProgress) {
        //     // If refreshTokenInProgress is true, we will wait until refreshTokenSubject has a non-null value
        //     // which means the new token is ready and we can retry the request again
        //     return this.refreshTokenSubject.pipe(
        //       filter((result) => result !== null),
        //       take(1),
        //       switchMap(() => next.handle(this.addAuthenticationToken(req)))
        //     );
        //   } else {
        //     this.refreshTokenInProgress = true;
        //     // Set the refreshTokenSubject to null so that subsequent API calls will wait until the new token has been retrieved
        //     this.refreshTokenSubject.next(null);
        //     return this.refreshAccessToken().pipe(
        //       switchMap((success: boolean) => {
        //         this.refreshTokenSubject.next(success);
        //         return next.handle(this.addAuthenticationToken(req));
        //       }),
        //       // When the call to refreshToken completes we reset the refreshTokenInProgress to false
        //       // for the next time the token needs to be refreshed
        //       finalize(() => (this.refreshTokenInProgress = false))
        //     );
        //   }
        // } else {
        //   return throwError(error);
        // }
        return throwError(error);
      })
    ) as Observable<HttpEvent<any>>;
  }

  private refreshAccessToken(): Observable<any> {
    // TODO: Add token refresh
    return of('secret token');
  }

  private addAuthenticationToken(request: HttpRequest<any>): HttpRequest<any> {
    // If we do not have a token yet then we should not set the header.
    // Here we could first retrieve the token from where we store it.
    if (!this.token) {
      return request;
    }
    // If you are calling an outside domain then do not add the token.
    // TODO: Add check for token clone
    // FIXME: Only add token to api domain
    // if (!request.url.match(/www.mydomain.com\//)) {
    //   return request;
    // }
    return request.clone({
      headers: request.headers.set(this.AUTH_HEADER, 'Bearer ' + this.token)
    });
  }
}

// TODO: Add Token refresh and prettify
