import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FooterSocialLoginComponent } from './footer-social-login.component';

describe('FooterSocialLoginComponent', () => {
  let component: FooterSocialLoginComponent;
  let fixture: ComponentFixture<FooterSocialLoginComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FooterSocialLoginComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FooterSocialLoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
