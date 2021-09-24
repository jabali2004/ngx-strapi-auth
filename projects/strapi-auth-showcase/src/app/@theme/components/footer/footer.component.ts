import { Component } from '@angular/core';

@Component({
  selector: 'app-footer',
  styleUrls: ['./footer.component.scss'],
  template: `
    <div class="row col-12 justify-content-between">
      <div class="d-flex">
        <span i18n class="created-by">
          {{ 'footer.text' | translate }}
          <b>
            <a href="https://example.com" target="_blank">Example</a>
          </b>
          2021
        </span>
      </div>

      <div class="d-flex">
        <a routerLink="/pages/impressum">
          <span>{{ 'footer.impressum' | translate }}</span>
        </a>
        |
        <a routerLink="/pages/contact">
          <span>{{ 'footer.contact' | translate }}</span>
        </a>
      </div>
    </div>
  `
})
export class FooterComponent {}
