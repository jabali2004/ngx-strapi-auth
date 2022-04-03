import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DefaultResetPasswordComponent } from './default-reset-password.component';

describe('DefaultResetPasswordComponent', () => {
  let component: DefaultResetPasswordComponent;
  let fixture: ComponentFixture<DefaultResetPasswordComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DefaultResetPasswordComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DefaultResetPasswordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
