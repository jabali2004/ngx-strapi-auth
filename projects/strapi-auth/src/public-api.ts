/*
 * Public API Surface of strapi-auth
 */

//  Modules
export { StrapiAuthModule } from './lib/strapi-auth.module';

// Services
export { AuthService } from './lib/services/auth/auth.service';
export { TokenService } from './lib/services/token/token.service';
export { LanguageService } from './lib/services/language/language.service';
export { TemplateService } from './lib/services/template/template.service';
export { ConfigServiceInjector as ConfigService } from './lib/services/config/config.service';

// Interceptors
export { AuthInterceptor } from './lib/interceptors/auth.interceptor';

// Guards
export { AuthGuard } from './lib/guards/auth/auth.guard';
export { TokenGuard } from './lib/guards/token/token.guard';
export { Role } from './lib/types/models/Role';

// Types
export {
  StrapiAuthConfig,
  StrapiAuthProviders,
  StrapiAuthRoutes,
  StrapiAuthTemplates,
  StrapiAuthTranslations
} from './lib/types/StrapiAuthConfig';

// Enums
export { AuthComponents } from './lib/types/enums/AuthComponents';

// Models
export { BaseModel } from './lib/types/models/BaseModel';
export { Token } from './lib/types/models/Token';
export { User, IUser } from './lib/types/models/User';

// Requests
export { IReqAuthLogin } from './lib/types/requests/ReqAuthLogin';
export { IReqAuthRegister } from './lib/types/requests/ReqAuthRegister';
export { IReqPasswordReset } from './lib/types/requests/ReqPasswordReset';
export { IReqUserUpdate } from './lib/types/requests/ReqUserUpdate';

// Responses
export { IResAuthLogin } from './lib/types/responses/ResAuthLogin';
export { IResAuthRegister } from './lib/types/responses/ResAuthRegister';
export { IResPasswordReset } from './lib/types/responses/ResPasswordReset';
export { IResRequestPasswordReset } from './lib/types/responses/ResRequestPasswordReset';

// Errors
export { IStrapiError, IAuthError } from './lib/types/responses/AuthError';

// Routing
export { StrapiAuthRoutingModule } from './lib/routing/strapi-auth-routing.module';

// BaseComponents
export { LoginBaseComponent } from './lib/components/base-components/login-base/login-base.component';
export { RegisterBaseComponent } from './lib/components/base-components/register-base/register-base.component';
export { LogoutBaseComponent } from './lib/components/base-components/logout-base/logout-base.component';
export { RequestPasswordBaseComponent } from './lib/components/base-components/request-password-base/request-password-base.component';
export { ResetPasswordBaseComponent } from './lib/components/base-components/reset-password-base/reset-password-base.component';

// DefaultComponents
export { DefaultLoginComponent } from './lib/components/default-components/default-login/default-login.component';
export { DefaultRegisterComponent } from './lib/components/default-components/default-register/default-register.component';
export { DefaultLogoutComponent } from './lib/components/default-components/default-logout/default-logout.component';
export { DefaultRequestPasswordComponent } from './lib/components/default-components/default-request-password/default-request-password.component';
export { DefaultResetPasswordComponent } from './lib/components/default-components/default-reset-password/default-reset-password.component';
