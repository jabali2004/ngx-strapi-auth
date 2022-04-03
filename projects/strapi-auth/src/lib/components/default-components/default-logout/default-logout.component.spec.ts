import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DefaultLogoutComponent } from './default-logout.component';

describe('DefaultLogoutComponent', () => {
  let component: DefaultLogoutComponent;
  let fixture: ComponentFixture<DefaultLogoutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DefaultLogoutComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DefaultLogoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
