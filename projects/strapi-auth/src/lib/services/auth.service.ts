import { Inject, Injectable } from '@angular/core';
import { UserDTO, IUserDTO } from '../types/UserDTO';
import {
  HttpClient,
  HttpBackend,
  HttpErrorResponse
} from '@angular/common/http';
import { IResAuthLogin } from '../types/ResAuthLogin';
import { Subject } from 'rxjs';
import { IResAuthRegister } from '../types/ResAuthRegister';
import { IReqAuthRegister } from '../types/ReqAuthRegister';
import { Router } from '@angular/router';
import { IReqUserUpdate } from '../types/ReqUserUpdate';
import { Token } from '../types/Token';
import {
  StrapiAuthConfig,
  StrapiAuthProviders
} from '../types/StrapiAuthConfig';
import { ConfigService } from './config.service';
import jwt_decode from 'jwt-decode';
import { TranslateService } from '@ngx-translate/core';

// Language files
import deLang from '../i18n/de.json';
import enLang from '../i18n/en.json';
import { IResRequestPasswordReset } from '../types/ResRequestPasswordReset';
import { IResPasswordReset } from '../types/ResPasswordReset';
import { IReqPasswordReset } from '../types/ReqPasswordReset';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl: string;
  private user: UserDTO;
  private token: string;
  private authHttpClient: HttpClient;

  private authState: Subject<void> = new Subject();
  private userState: Subject<void> = new Subject();

  public isAuthenticated: boolean;

  public readonly strapiAuthConfig: StrapiAuthConfig;

  // TODO: Add error handling for login and register post

  constructor(
    private httpClient: HttpClient,
    private handler: HttpBackend,
    private router: Router,
    @Inject(ConfigService) private config: StrapiAuthConfig
  ) {
    this.strapiAuthConfig = config;

    this.apiUrl = this.config.strapi_base_url || 'http://localhost:1337';
    // Requests wont get intercepted
    this.authHttpClient = new HttpClient(handler);

    this.token = this.readToken();
    if (this.token) {
      this.isAuthenticated = true;
      this.authState.next();
    }
  }

  /**
   * Return AuthState Promise
   */
  public get AuthState(): Subject<void> {
    return this.authState;
  }

  /**
   * Return AuthState Promise
   */
  public get UserState(): Subject<void> {
    return this.userState;
  }

  /**
   * Return login redirect url
   */
  public get LoginRedirectUrl(): string {
    return this.strapiAuthConfig.routes.loginRedirect || '';
  }

  /**
   * Return login url
   */
  public get LoginUrl(): string {
    return this.strapiAuthConfig.routes.login || 'auth/login';
  }

  /**
   * Return logout url
   */
  public get LogoutUrl(): string {
    return this.strapiAuthConfig.routes.login || 'auth/logout';
  }

  /**
   * Return logout redirect url
   */
  public get LogoutRedirectUrl(): string {
    return this.strapiAuthConfig.routes.logoutRedirect || '';
  }

  /**
   * Return register url
   */
  public get RegisterUrl(): string {
    return this.strapiAuthConfig.routes.register || 'auth/register';
  }

  /**
   * Return request password url
   */
  public get RequestPasswordUrl(): string {
    return (
      this.strapiAuthConfig.routes.requestPassword || 'auth/request-password'
    );
  }

  /**
   * Return request password redirect url
   */
  public get RequestPasswordRedirectUrl(): string {
    return this.strapiAuthConfig.routes.requestPasswordRedirect || '';
  }

  /**
   * Return reset password url
   */
  public get ResetPasswordUrl(): string {
    return this.strapiAuthConfig.routes.resetPassword || 'auth/reset-password';
  }

  /**
   * Set default translation for StrapiAuthModule
   */
  public async setDefaultTranslation(
    translate: TranslateService
  ): Promise<void> {
    // TODO: decrease loading time
    // Currently all files are loaded
    await translate
      .getTranslation('de')
      .toPromise()
      .then(() => {
        translate.setTranslation('de', deLang, true);
      });

    await translate
      .getTranslation('en')
      .toPromise()
      .then(() => {
        translate.setTranslation('en', enLang, true);
      });

    return;
  }

  /**
   * Login user with given credentials
   * and store jwt token and user data
   */
  public async login(email: string, password: string): Promise<void> {
    const res: IResAuthLogin | HttpErrorResponse = await this.postLogin(
      email,
      password
    );

    if (res) {
      this.setTokenResponse(res as IResAuthLogin);
    }
  }

  /**
   * Login user using external provider
   * like google / facebook / microsoft / github
   */
  public async callbackProviderLogin(
    params: string,
    provider: StrapiAuthProviders
  ): Promise<void> {
    try {
      const res: IResAuthLogin | void = (await this.authHttpClient
        .get(this.apiUrl + '/auth/' + provider + '/callback?' + params)
        .toPromise()) as IResAuthLogin | void;

      if (res) {
        this.setTokenResponse(res);
      }
    } catch (error) {
      console.error(error);
      return;
    }
  }

  /**
   * Register neu user with given data
   *
   * If registration has jwt token and user data in response
   * then store token and show user as logged in
   *
   */
  public async register(
    email: string,
    username: string,
    password: string
  ): Promise<void> {
    const req: IReqAuthRegister = {
      username,
      email,
      password
    };

    const res: IResAuthRegister | HttpErrorResponse = await this.postRegister(
      req
    );

    if (res) {
      this.setTokenResponse(res as IResAuthRegister);
    }
  }

  /**
   * Logout user
   */
  public async logout(): Promise<void> {
    this.isAuthenticated = false;
    this.user = null;
    this.authState.next();
    this.deleteToken();
  }

  /**
   * Update user profile
   */
  public async updateProfile(updateReq: IReqUserUpdate): Promise<void> {
    const res: IUserDTO | HttpErrorResponse = await this.updateUser(updateReq);

    if (res) {
      this.user = new UserDTO(res);
      this.userState.next();
    }
  }

  /**
   * Request password reset mail
   */
  public async requestPasswordReset(email: string): Promise<void> {
    const res: IResRequestPasswordReset | HttpErrorResponse =
      await this.postRequestPasswordReset(email);
  }

  /**
   * Reset user password
   */
  public async resetPassword(
    passwordResetReq: IReqPasswordReset
  ): Promise<void> {
    const res: IResPasswordReset | HttpErrorResponse =
      await this.postResetPassword(passwordResetReq);
  }

  /**
   * return token if given
   */
  public getToken(): string {
    return this.token !== null ? this.token : this.readToken();
  }

  /**
   * Set token variable and write token to local storage
   */
  public setToken(token: string): void {
    this.token = token;
    this.writeToken(token);
  }

  /**
   * return user obj
   */
  public getUser(): IUserDTO {
    return this.user;
  }

  /**
   * Load own user obj
   */
  public async loadUser(): Promise<void> {
    this.requestUser().then((user) => {
      if (user) {
        this.user = new UserDTO(user);
        this.userState.next();
      }
    });
  }

  /**
   * Write token to local storage
   */
  private writeToken(token: string): void {
    localStorage.setItem('token', token);
  }

  /**
   * Read token from local storage
   */
  private readToken(): string {
    return localStorage.getItem('token');
  }

  /**
   * Delete token in local storage
   */
  private deleteToken(): void {
    localStorage.removeItem('token');
  }

  /**
   * Write token to store and
   * call auth state subject
   */
  private setTokenResponse(res: IResAuthRegister | IResAuthLogin): void {
    if (res.jwt && res.user) {
      this.token = res.jwt;
      this.user = new UserDTO(res.user);

      this.isAuthenticated = true;
      this.authState.next();
      this.userState.next();

      this.writeToken(this.token);
    }
  }

  /**
   * Call API for own user obj
   * and return it
   */
  private async requestUser(): Promise<IUserDTO | HttpErrorResponse> {
    try {
      const res: IUserDTO | HttpErrorResponse = (await this.httpClient
        .get(this.apiUrl + '/users/me', {})
        .toPromise()) as IUserDTO | HttpErrorResponse;

      return res;
    } catch (error) {
      throw new HttpErrorResponse(error);
    }
  }

  /**
   * Update user
   */
  private async updateUser(
    updateReq: IReqUserUpdate
  ): Promise<IUserDTO | HttpErrorResponse> {
    try {
      const res: IUserDTO | HttpErrorResponse = (await this.httpClient
        .put(this.apiUrl + '/users/me', updateReq)
        .toPromise()) as IUserDTO | HttpErrorResponse;

      return res;
    } catch (error) {
      throw new HttpErrorResponse(error);
    }
  }

  /**
   * Login user and request token
   */
  private async postLogin(
    identifier: string,
    password: string
  ): Promise<IResAuthLogin | HttpErrorResponse> {
    try {
      const res: IResAuthLogin | HttpErrorResponse = (await this.authHttpClient
        .post(this.apiUrl + '/auth/local', {
          identifier,
          password
        })
        .toPromise()) as IResAuthLogin | HttpErrorResponse;

      return res;
    } catch (error) {
      throw new HttpErrorResponse(error);
    }
  }

  /**
   * Register new user
   */
  private async postRegister(
    registerReq: IReqAuthRegister
  ): Promise<IResAuthRegister | HttpErrorResponse> {
    try {
      const res: IResAuthRegister | HttpErrorResponse =
        (await this.authHttpClient
          .post(this.apiUrl + '/auth/local/register', {
            username: registerReq.username,
            email: registerReq.email,
            password: registerReq.password
          })
          .toPromise()) as IResAuthRegister | HttpErrorResponse;

      return res;
    } catch (error) {
      throw new HttpErrorResponse(error);
    }
  }

  /**
   * Request password reset
   */
  private async postRequestPasswordReset(
    email: string
  ): Promise<IResRequestPasswordReset | HttpErrorResponse> {
    try {
      const res: IResRequestPasswordReset | HttpErrorResponse =
        (await this.authHttpClient
          .post(this.apiUrl + '/auth/forgot-password', { email })
          .toPromise()) as IResRequestPasswordReset | HttpErrorResponse;

      return res;
    } catch (error) {
      throw new HttpErrorResponse(error);
    }
  }

  /**
   * Reset password
   */
  private async postResetPassword(
    passwordResetReq: IReqPasswordReset
  ): Promise<IResPasswordReset | HttpErrorResponse> {
    try {
      const res: IResPasswordReset | HttpErrorResponse =
        (await this.authHttpClient
          .post(this.apiUrl + '/auth/reset-password', passwordResetReq)
          .toPromise()) as IResPasswordReset | HttpErrorResponse;

      return res;
    } catch (error) {
      throw new HttpErrorResponse(error);
    }
  }

  /**
   * Decode token
   */
  private decodeToken(token: string): Token | void {
    try {
      return jwt_decode(token) as Token;
    } catch (error) {
      return;
    }
  }
}
