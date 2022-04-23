import { ChangeDetectorRef, Component, Inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { AuthService } from '../../../services/auth/auth.service';
import { ConfigService } from '../../../services/config/config.service';
import { StrapiAuthConfig } from '../../../types/StrapiAuthConfig';
import { LoginBaseComponent } from '../../base-components/login-base/login-base.component';

@Component({
  selector: 'strapi-default-login',
  templateUrl: './default-login.component.html',
  styleUrls: ['./default-login.component.scss']
})
export class DefaultLoginComponent
  extends LoginBaseComponent
  implements OnInit
{
  constructor(
    protected authService: AuthService,
    protected cd: ChangeDetectorRef,
    protected router: Router,
    protected translate: TranslateService,
    @Inject(ConfigService) public strapiAuthConfig: StrapiAuthConfig
  ) {
    super(authService, cd, router, translate, strapiAuthConfig);
  }

  ngOnInit(): void {}
}
