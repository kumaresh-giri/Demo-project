import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BecomeCodeEnforcerComponent } from './become-code-enforcer.component';

describe('BecomeCodeEnforcerComponent', () => {
  let component: BecomeCodeEnforcerComponent;
  let fixture: ComponentFixture<BecomeCodeEnforcerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BecomeCodeEnforcerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BecomeCodeEnforcerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
