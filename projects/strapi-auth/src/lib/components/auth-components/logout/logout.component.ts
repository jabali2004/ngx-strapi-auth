import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'strapi-logout',
  templateUrl: './logout.component.html',
  styleUrls: ['./logout.component.scss']
})
export class LogoutComponent implements OnInit, OnDestroy {
  redirectDelay = 0;

  constructor(protected authService: AuthService, protected router: Router) {}

  ngOnInit(): void {
    this.logout();
  }

  ngOnDestroy(): void {}

  logout(): void {
    this.authService.logout().then(() => {
      this.router.navigateByUrl(this.authService.LogoutRedirectUrl);
    });
  }
}
