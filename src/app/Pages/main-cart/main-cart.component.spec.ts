import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MainCartComponent } from './main-cart.component';

describe('MainCartComponent', () => {
  let component: MainCartComponent;
  let fixture: ComponentFixture<MainCartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MainCartComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MainCartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
