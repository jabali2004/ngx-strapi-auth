export type StrapiAuthProviders =
  | 'github'
  | 'google'
  | 'microsoft'
  | 'facebook'
  | 'twitter';

export interface StrapiAuthConfig {
  strapi_base_url: string;
  strapi_auth_providers?: StrapiAuthProviders[];
  login_redirect_url?: string;
}
