import type { Component } from '@angular/core';
import { Inject } from '@angular/core';
import { Injectable } from '@angular/core';
import { ConfigService } from '../config/config.service';
import AuthComponents from '../../types/enums/AuthComponents';
import { StrapiAuthConfig } from '../../types/StrapiAuthConfig';
import { DefaultLoginComponent } from '../../components/default-components/default-login/default-login.component';
import { DefaultLogoutComponent } from '../../components/default-components/default-logout/default-logout.component';
import { DefaultRegisterComponent } from '../../components/default-components/default-register/default-register.component';
import { DefaultRequestPasswordComponent } from '../../components/default-components/default-request-password/default-request-password.component';
import { DefaultResetPasswordComponent } from '../../components/default-components/default-reset-password/default-reset-password.component';

@Injectable({
  providedIn: 'root'
})
export class TemplateService {
  private templates: { [id: string]: Component } = {};

  public readonly config: StrapiAuthConfig;

  constructor(@Inject(ConfigService) private _config: StrapiAuthConfig) {
    this.config = this._config;

    this.setDefaultTemplates();
    this.mapTemplates();
  }

  /**
   * Get component by ControlType
   * @param authComponent
   * @returns Component
   */
  public getComponent(authComponent: AuthComponents): Component {
    return this.getComponentByType(authComponent);
  }

  /**
   * Inject component for specific template
   * @param template
   * @param authComponent
   */
  public setTemplate(template: Component, authComponent: AuthComponents): void {
    this.templates[authComponent] = template;
  }

  /**
   * Get all registered templates
   */
  public get RegisteredTemplates(): { [id: string]: Component } {
    return this.templates;
  }

  // TODO: Add template functionality for every component

  /**
   * Set all default templates for each component
   */
  private setDefaultTemplates(): void {
    this.templates[AuthComponents.Login] = DefaultLoginComponent as Component;

    this.templates[AuthComponents.Logout] = DefaultLogoutComponent as Component;

    this.templates[AuthComponents.Register] =
      DefaultRegisterComponent as Component;

    this.templates[AuthComponents.RequestPassword] =
      DefaultRequestPasswordComponent as Component;

    this.templates[AuthComponents.ResetPassword] =
      DefaultResetPasswordComponent as Component;
  }

  /**
   * Map all templates
   */
  private mapTemplates(): void {
    if (this.config && this.config.templates) {
      for (const templateName in this.config.templates) {
        const template = this.config.templates[templateName];
        this.templates[templateName] = template;
      }
    }
  }

  /**
   * Get component by ControlType
   * @param authComponent
   * @returns Component
   */
  private getComponentByType(authComponent: AuthComponents): Component {
    return this.templates[authComponent] as Component;
  }
}
