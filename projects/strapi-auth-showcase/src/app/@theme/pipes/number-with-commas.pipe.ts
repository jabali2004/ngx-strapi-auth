import type { PipeTransform } from '@angular/core';
import { Pipe } from '@angular/core';

@Pipe({ name: 'ngxNumberWithCommas' })
export class NumberWithCommasPipe implements PipeTransform {

  transform(input: number): string {
    return new Intl.NumberFormat().format(input);
  }
}
