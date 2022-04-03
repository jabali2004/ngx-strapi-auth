import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DefaultRequestPasswordComponent } from './default-request-password.component';

describe('DefaultRequestPasswordComponent', () => {
  let component: DefaultRequestPasswordComponent;
  let fixture: ComponentFixture<DefaultRequestPasswordComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DefaultRequestPasswordComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DefaultRequestPasswordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
