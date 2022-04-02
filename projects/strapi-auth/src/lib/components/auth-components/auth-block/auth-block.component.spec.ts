import type { ComponentFixture} from '@angular/core/testing';
import { TestBed, waitForAsync } from '@angular/core/testing';

import { AuthBlockComponent } from './auth-block.component';

describe('AuthBlockComponent', () => {
  let component: AuthBlockComponent;
  let fixture: ComponentFixture<AuthBlockComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [AuthBlockComponent],
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(AuthBlockComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
