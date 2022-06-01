import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { AuthService } from '../../../services/auth/auth.service';
import { ResetPasswordBaseComponent } from '../../base-components/reset-password-base/reset-password-base.component';

@Component({
  selector: 'strapi-default-reset-password',
  templateUrl: './default-reset-password.component.html',
  styleUrls: ['./default-reset-password.component.scss']
})
export class DefaultResetPasswordComponent
  extends ResetPasswordBaseComponent
  implements OnInit
{
  constructor(
    protected cd: ChangeDetectorRef,
    protected router: Router,
    protected route: ActivatedRoute,
    protected authService: AuthService,
    protected translate: TranslateService
  ) {
    super(cd, router, route, authService, translate);
  }

  ngOnInit(): void {}
}
