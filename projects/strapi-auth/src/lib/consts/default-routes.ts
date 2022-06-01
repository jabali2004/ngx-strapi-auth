import { StrapiAuthRoutes } from '../types/StrapiAuthConfig';

export const DEFAULT_ROUTES: StrapiAuthRoutes = {
  login: '/auth/login',
  logout: '/auth/logout',
  register: '/auth/register',
  requestPassword: '/auth/request-password',
  resetPassword: '/auth/reset-password',
  loginRedirect: '/',
  logoutRedirect: '/auth/login',
  requestPasswordRedirect: '/auth/login'
};
