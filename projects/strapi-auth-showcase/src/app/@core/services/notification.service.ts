import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { NbToastrService, NbComponentStatus } from '@nebular/theme';

@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  constructor(
    private translate: TranslateService,
    private toastrService: NbToastrService
  ) {}

  public show(
    title: string,
    message: string,
    status?: NbComponentStatus,
    icon?: string
  ): void {
    this.toastrService.show(message, title, {
      icon: icon ? icon : 'eye-outline',
      status: status ? status : 'basic',
      destroyByClick: true,
    });
  }
}
