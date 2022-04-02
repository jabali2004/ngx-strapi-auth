import type { PipeTransform } from '@angular/core';
import { Pipe } from '@angular/core';

@Pipe({ name: 'ngxPlural' })
export class PluralPipe implements PipeTransform {

  transform(input: number, label: string, pluralLabel = ''): string {
    input = input || 0;
    return input === 1
      ? `${input} ${label}`
      : pluralLabel
        ? `${input} ${pluralLabel}`
        : `${input} ${label}s`;
  }
}
