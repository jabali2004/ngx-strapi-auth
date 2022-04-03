import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RequestPasswordBaseComponent } from './request-password-base.component';

describe('RequestPasswordBaseComponent', () => {
  let component: RequestPasswordBaseComponent;
  let fixture: ComponentFixture<RequestPasswordBaseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RequestPasswordBaseComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RequestPasswordBaseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
