import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegisterBaseComponent } from './register-base.component';

describe('RegisterBaseComponent', () => {
  let component: RegisterBaseComponent;
  let fixture: ComponentFixture<RegisterBaseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RegisterBaseComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RegisterBaseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
