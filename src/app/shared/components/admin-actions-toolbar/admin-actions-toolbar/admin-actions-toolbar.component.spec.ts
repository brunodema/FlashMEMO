import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminActionsToolbarComponent } from './admin-actions-toolbar.component';

describe('AdminActionsToolbarComponent', () => {
  let component: AdminActionsToolbarComponent;
  let fixture: ComponentFixture<AdminActionsToolbarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdminActionsToolbarComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminActionsToolbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
