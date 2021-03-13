/*
 * Public API Surface of strapi-auth
 */

//  Modules
export { StrapiAuthModule } from './lib/strapi-auth.module';

// Services
export { AuthService } from './lib/services/auth.service';

// Interceptors
export { AuthInterceptor } from './lib/interceptors/auth.interceptor';

// Guards
export { AuthGuard } from './lib/guards/auth.guard';

// Routing
export { StrapiAuthRoutingModule } from './lib/routing/strapi-auth-routing.module';

// Types
export { BaseModel } from './lib/types/BaseModel';
export { IReqAuthRegister } from './lib/types/ReqAuthRegister';
export { IReqUserUpdate } from './lib/types/ReqUserUpdate';
export { IResAuthLogin } from './lib/types/ResAuthLogin';
export { IResAuthRegister } from './lib/types/ResAuthRegister';
export { Role } from './lib/types/Role';
export {
  StrapiAuthConfig,
  StrapiAuthProviders
} from './lib/types/StrapiAuthConfig';
export { Token } from './lib/types/Token';
export { UserDTO, IUserDTO } from './lib/types/UserDTO';

// Components
export { AuthComponentsComponent } from './lib/components/auth-components/auth-components.component';
export { AuthBlockComponent } from './lib/components/auth-components/auth-block/auth-block.component';
export { LoginComponent } from './lib/components/auth-components/login/login.component';
export { LogoutComponent } from './lib/components/auth-components/logout/logout.component';
export { RegisterComponent } from './lib/components/auth-components/register/register.component';
export { RequestPasswordComponent } from './lib/components/auth-components/request-password/request-password.component';
export { ResetPasswordComponent } from './lib/components/auth-components/reset-password/reset-password.component';
export { ProfileComponent } from './lib/components/profile/profile.component';
