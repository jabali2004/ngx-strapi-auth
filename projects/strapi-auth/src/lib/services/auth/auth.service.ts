import {
  HttpBackend,
  HttpClient,
  HttpErrorResponse
} from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { lastValueFrom, Subject } from 'rxjs';
import { Token } from '../../types/models/Token';
import { IUser } from '../../types/models/User';
import { IReqAuthRegister } from '../../types/requests/ReqAuthRegister';
import { IReqPasswordReset } from '../../types/requests/ReqPasswordReset';
import { IReqUserUpdate } from '../../types/requests/ReqUserUpdate';
import { IResPasswordReset } from '../../types/responses/ResPasswordReset';
import { IResRequestPasswordReset } from '../../types/responses/ResRequestPasswordReset';
import { IResAuthLogin } from '../../types/responses/ResAuthLogin';
import { IResAuthRegister } from '../../types/responses/ResAuthRegister';
import {
  StrapiAuthConfig,
  StrapiAuthProviders
} from '../../types/StrapiAuthConfig';
import { ConfigService, ConfigServiceInjector } from '../config/config.service';
import { TokenService } from '../token/token.service';
import { IReqAuthLogin } from '../../types/requests/ReqAuthLogin';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl: string;
  private user: IUser;
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
    private tokenService: TokenService,
    private configService: ConfigService,
    @Inject(ConfigServiceInjector) private config: StrapiAuthConfig
  ) {
    this.strapiAuthConfig = config;

    this.configService.applyRoutesConfig(this.strapiAuthConfig);

    console.log(this.strapiAuthConfig);

    this.apiUrl = this.config.strapi_base_url || 'http://localhost:1337';

    // Requests wont get intercepted
    this.authHttpClient = new HttpClient(handler);

    const token = this.tokenService.getToken();
    if (token) {
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
   * Login user with given credentials
   * and store jwt token and user data
   */
  public async login(loginReq: IReqAuthLogin): Promise<void> {
    const res: IResAuthLogin | HttpErrorResponse = await this.postLogin(
      loginReq
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
  public async register(req: IReqAuthRegister): Promise<void> {
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
    this.tokenService.deleteToken();
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
   * Write token to store and
   * call auth state subject
   */
  private setTokenResponse(res: IResAuthRegister | IResAuthLogin): void {
    if (res.jwt && res.user) {
      this.user = res.user as IUser;

      this.isAuthenticated = true;
      this.authState.next();
      this.userState.next();

      this.tokenService.setToken(res.jwt);
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
    loginReq: IReqAuthLogin
  ): Promise<IResAuthLogin | HttpErrorResponse> {
    try {
      const res: IResAuthLogin | HttpErrorResponse = (await lastValueFrom(
        this.authHttpClient.post(this.apiUrl + '/auth/local', loginReq)
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
}
