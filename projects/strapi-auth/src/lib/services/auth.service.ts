import { Inject, Injectable } from '@angular/core';
import { User, IUser } from '../types/models/User';
import {
  HttpClient,
  HttpBackend,
  HttpErrorResponse
} from '@angular/common/http';
import { IResAuthLogin } from '../types/responses/ResAuthLogin';
import { lastValueFrom, Subject } from 'rxjs';
import { IResAuthRegister } from '../types/responses/ResAuthRegister';
import { IReqAuthRegister } from '../types/requests/ReqAuthRegister';
import { Router } from '@angular/router';
import { IReqUserUpdate } from '../types/requests/ReqUserUpdate';
import { Token } from '../types/models/Token';
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
import { IResRequestPasswordReset } from '../types/requests/ResRequestPasswordReset';
import { IResPasswordReset } from '../types/requests/ResPasswordReset';
import { IReqPasswordReset } from '../types/requests/ReqPasswordReset';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl: string;
  private user: IUser;
  private token: string;
  private authHttpClient: HttpClient;

  private authState: Subject<void> = new Subject();
  private userState: Subject<void> = new Subject();

  public isAuthenticated: boolean;

  public readonly strapiAuthConfig: StrapiAuthConfig;

  // TODO: Add error handling for login and register post
  // TODO: Cleanup AuthService

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
    return this.strapiAuthConfig.routes.loginRedirect || '/';
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
    return this.strapiAuthConfig.routes.logoutRedirect || '/';
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
    return this.strapiAuthConfig.routes.requestPasswordRedirect || '/';
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
    // TODO: decrease loading time && load only specified languages
    // Currently all files are loaded
    await lastValueFrom(translate.getTranslation('en')).then(() => {
      translate.setTranslation('en', enLang, true);
    });

    await lastValueFrom(translate.getTranslation('de')).then(() => {
      translate.setTranslation('de', deLang, true);
    });

    translate.setDefaultLang(translate.getDefaultLang());

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
      const res: IResAuthLogin | void = (await lastValueFrom(
        this.authHttpClient.get(
          this.apiUrl + '/auth/' + provider + '/callback?' + params
        )
      )) as IResAuthLogin | void;

      if (res) {
        this.setTokenResponse(res);
      }
    } catch (error) {
      console.error(error);
      return;
    }
  }

  /**
   * Register new user with given data
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
    const res: IUser | HttpErrorResponse = await this.updateUser(updateReq);

    if (res) {
      this.user = res as IUser;
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
   * Return token if given
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
  public getUser(): IUser {
    return this.user;
  }

  /**
   * Load own user obj
   */
  public async loadUser(): Promise<void> {
    this.requestUser().then((user) => {
      if (user) {
        this.user = user as IUser;
        this.userState.next();
      }
    });
  }

  /**
   * Write token to local storage
   */
  private writeToken(token: string): void {
    sessionStorage.setItem('token', token);
  }

  /**
   * Read token from local storage
   */
  private readToken(): string {
    return sessionStorage.getItem('token');
  }

  /**
   * Delete token in local storage
   */
  private deleteToken(): void {
    sessionStorage.removeItem('token');
  }

  /**
   * Write token to store and
   * call auth state subject
   */
  private setTokenResponse(res: IResAuthRegister | IResAuthLogin): void {
    if (res.jwt && res.user) {
      this.token = res.jwt;
      this.user = res.user as IUser;

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
  private async requestUser(): Promise<IUser | HttpErrorResponse> {
    try {
      const res: IUser | HttpErrorResponse = (await lastValueFrom(
        this.httpClient.get(this.apiUrl + '/users/me', {})
      )) as IUser | HttpErrorResponse;

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
  ): Promise<IUser | HttpErrorResponse> {
    // TODO: Check if functionality is given
    // Updating a user (authenticated user) profile is currently not built into strapi (in that way)
    try {
      const res: IUser | HttpErrorResponse = (await lastValueFrom(
        this.httpClient.put(this.apiUrl + '/users/me', updateReq)
      )) as IUser | HttpErrorResponse;

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
      const res: IResAuthLogin | HttpErrorResponse = (await lastValueFrom(
        this.authHttpClient.post(this.apiUrl + '/auth/local', {
          identifier,
          password
        })
      )) as IResAuthLogin | HttpErrorResponse;

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
      const res: IResAuthRegister | HttpErrorResponse = (await lastValueFrom(
        this.authHttpClient.post(this.apiUrl + '/auth/local/register', {
          username: registerReq.username,
          email: registerReq.email,
          password: registerReq.password
        })
      )) as IResAuthRegister | HttpErrorResponse;

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
        (await lastValueFrom(
          this.authHttpClient.post(this.apiUrl + '/auth/forgot-password', {
            email
          })
        )) as IResRequestPasswordReset | HttpErrorResponse;

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
      const res: IResPasswordReset | HttpErrorResponse = (await lastValueFrom(
        this.authHttpClient.post(
          this.apiUrl + '/auth/reset-password',
          passwordResetReq
        )
      )) as IResPasswordReset | HttpErrorResponse;

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
