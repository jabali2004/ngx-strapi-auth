import { NbMenuService } from '@nebular/theme';
import { Component } from '@angular/core';

@Component({
  selector: 'app-not-found',
  styleUrls: ['./not-found.component.scss'],
  templateUrl: './not-found.component.html',
})
export class NotFoundComponent {
  constructor(private menuService: NbMenuService) {}

  goToHome(): void {
    this.menuService.navigateHome();
  }
}
