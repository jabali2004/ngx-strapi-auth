import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { AuthService } from '../../../services/auth/auth.service';
import { RequestPasswordBaseComponent } from '../../base-components/request-password-base/request-password-base.component';

@Component({
  selector: 'strapi-default-request-password',
  templateUrl: './default-request-password.component.html',
  styleUrls: ['./default-request-password.component.scss']
})
export class DefaultRequestPasswordComponent
  extends RequestPasswordBaseComponent
  implements OnInit
{
  constructor(
    protected cd: ChangeDetectorRef,
    protected router: Router,
    protected authService: AuthService,
    protected translate: TranslateService
  ) {
    super(cd, router, authService, translate);
  }

  ngOnInit(): void {}
}
