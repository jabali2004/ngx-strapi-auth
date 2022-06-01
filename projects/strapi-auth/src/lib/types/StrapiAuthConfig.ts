import { Component } from '@angular/core';
import { AuthComponents } from './enums/AuthComponents';

export type StrapiAuthProviders =
  | 'github'
  | 'facebook'
  | 'google'
  | 'cognito'
  | 'twitter'
  | 'discord'
  | 'twitch'
  | 'instagram'
  | 'vk'
  | 'linkedin'
  | 'reddit'
  | 'auth0';

export type StrapiAuthRoutes = {
  // default: /auth/login
  login?: string;
  // default: /auth/logout
  logout?: string;
  // default: /auth/register
  register?: string;
  // default: /auth/request-password
  requestPassword?: string;
  // default: /auth/reset-password
  resetPassword?: string;
  // default: /
  loginRedirect?: string;
  // default: /
  logoutRedirect?: string;
  // default: /
  requestPasswordRedirect?: string;
};

export type StrapiAuthTranslations = {
  [key in AuthComponents]: string;
};

export type StrapiAuthTemplates = {
  [key: string]: Component;
};

export interface StrapiAuthConfig {
  strapi_base_url: string;
  auth_providers?: StrapiAuthProviders[];
  routes?: StrapiAuthRoutes;
  translations?: StrapiAuthTranslations;
  templates?: StrapiAuthTemplates;
}
