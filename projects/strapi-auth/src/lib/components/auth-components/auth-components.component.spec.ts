import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { AuthComponentsComponent } from './auth-components.component';

describe('AuthComponentsComponent', () => {
  let component: AuthComponentsComponent;
  let fixture: ComponentFixture<AuthComponentsComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [AuthComponentsComponent],
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(AuthComponentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
