import type { ComponentFixture} from '@angular/core/testing';
import { TestBed, waitForAsync } from '@angular/core/testing';

import { AbstractDialogComponent } from './abstract-dialog.component';

describe('AbstractDialogComponent', () => {
  let component: AbstractDialogComponent;
  let fixture: ComponentFixture<AbstractDialogComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [AbstractDialogComponent],
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(AbstractDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
