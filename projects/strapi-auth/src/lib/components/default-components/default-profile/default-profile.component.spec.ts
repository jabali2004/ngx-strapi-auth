import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DefaultProfileComponent } from './default-profile.component';

describe('DefaultProfileComponent', () => {
  let component: DefaultProfileComponent;
  let fixture: ComponentFixture<DefaultProfileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DefaultProfileComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DefaultProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
