import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MyaccountLeftSidebarComponent } from './myaccount-left-sidebar.component';

describe('MyaccountLeftSidebarComponent', () => {
  let component: MyaccountLeftSidebarComponent;
  let fixture: ComponentFixture<MyaccountLeftSidebarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MyaccountLeftSidebarComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MyaccountLeftSidebarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
