import { Injectable } from '@angular/core';
import type { Observable} from 'rxjs';
import { Subject } from 'rxjs';
import { delay, share } from 'rxjs/operators';

@Injectable()
export class LayoutService {
  protected layoutSize$: Subject<null> = new Subject();

  changeLayoutSize(): void {
    this.layoutSize$.next(null);
  }

  onChangeLayoutSize(): Observable<any> {
    return this.layoutSize$.pipe(share(), delay(1));
  }
}
