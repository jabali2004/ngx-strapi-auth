import { ChangeDetectorRef, Component, Inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { AuthService } from '../../../services/auth/auth.service';
import { ConfigService } from '../../../services/config/config.service';
import { StrapiAuthConfig } from '../../../types/StrapiAuthConfig';
import { LogoutBaseComponent } from '../../base-components/logout-base/logout-base.component';

@Component({
  selector: 'strapi-default-logout',
  templateUrl: './default-logout.component.html',
  styleUrls: ['./default-logout.component.scss']
})
export class DefaultLogoutComponent
  extends LogoutBaseComponent
  implements OnInit
{
  constructor(protected authService: AuthService, protected router: Router) {
    super(authService, router);
  }

  ngOnInit(): void {}
}
