import { Injectable } from '@angular/core';
import type { TranslateService } from '@ngx-translate/core';
import { lastValueFrom } from 'rxjs';

// Language files
import deLang from '../../i18n/de.json';
import enLang from '../../i18n/en.json';

@Injectable({
  providedIn: 'root'
})
export class LanguageService {
  constructor() {}

  // TODO: Rewrite language service and accept ngx-translate or custom language config object for translations
  // TODO: Store registered languages

  /**
   * Set default translation for StrapiAuthModule
   */
  public async setDefaultTranslation(
    translate: TranslateService
  ): Promise<void> {
    await this.loadTranslationFiles(translate);

    const defaultLang = this.getDefaultLanguage(translate);
    translate.setDefaultLang(defaultLang);
  }

  /**
   * Load translation files
   * @param translate
   */
  private async loadTranslationFiles(translate: TranslateService) {
    // TODO: decrease loading time && load only specified languages
    // Currently all files are loaded
    await lastValueFrom(translate.getTranslation('en')).then(() => {
      translate.setTranslation('en', enLang, true);
    });

    await lastValueFrom(translate.getTranslation('de')).then(() => {
      translate.setTranslation('de', deLang, true);
    });
  }

  /**
   * Get default language
   * @param translate
   * @returns string
   */
  private getDefaultLanguage(translate: TranslateService): string {
    const defaultLang = translate.getDefaultLang();
    return defaultLang || 'en';
  }
}
