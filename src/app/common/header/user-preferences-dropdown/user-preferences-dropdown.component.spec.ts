import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserPreferencesDropdownComponent } from './user-preferences-dropdown.component';

describe('UserPreferencesDropdownComponent', () => {
  let component: UserPreferencesDropdownComponent;
  let fixture: ComponentFixture<UserPreferencesDropdownComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UserPreferencesDropdownComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UserPreferencesDropdownComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
