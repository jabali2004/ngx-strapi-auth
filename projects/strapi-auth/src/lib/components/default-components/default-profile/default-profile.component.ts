import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { AuthService } from '../../../services/auth/auth.service';
import { ProfileBaseComponent } from '../../base-components/profile-base/profile-base.component';

@Component({
  selector: 'strapi-default-profile',
  templateUrl: './default-profile.component.html',
  styleUrls: ['./default-profile.component.scss']
})
export class DefaultProfileComponent extends ProfileBaseComponent {
  constructor(
    protected authService: AuthService,
    protected translate: TranslateService
  ) {
    super(authService, translate);
  }
}
