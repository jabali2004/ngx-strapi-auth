import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LogoutBaseComponent } from './logout-base.component';

describe('LogoutBaseComponent', () => {
  let component: LogoutBaseComponent;
  let fixture: ComponentFixture<LogoutBaseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LogoutBaseComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LogoutBaseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
