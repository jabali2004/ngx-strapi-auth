import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResetPasswordBaseComponent } from './reset-password-base.component';

describe('ResetPasswordBaseComponent', () => {
  let component: ResetPasswordBaseComponent;
  let fixture: ComponentFixture<ResetPasswordBaseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ResetPasswordBaseComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ResetPasswordBaseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
