import { Inject, Injectable, InjectionToken } from '@angular/core';
import { DEFAULT_ROUTES } from '../../consts/default-routes';
import type { StrapiAuthConfig } from '../../types/StrapiAuthConfig';

/**
 * This is not a real service, but it looks like it from the outside.
 * It's just an InjectionTToken used to import the config object, provided from the outside
 */
export const ConfigServiceInjector = new InjectionToken<StrapiAuthConfig>(
  'StrapiAuthConfig'
);

@Injectable({
  providedIn: 'root'
})
export class ConfigService {
  constructor() {}

  public applyRoutesConfig(config: StrapiAuthConfig): void {
    if (config.routes) {
      const merged = { ...DEFAULT_ROUTES, ...config.routes };
      config.routes = merged;
    } else {
      config.routes = DEFAULT_ROUTES;
    }
  }
}
