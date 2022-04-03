import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../services/auth/auth.service';

@Component({
  selector: 'strapi-logout-base',
  template: ''
})
export class LogoutBaseComponent implements OnInit {
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
