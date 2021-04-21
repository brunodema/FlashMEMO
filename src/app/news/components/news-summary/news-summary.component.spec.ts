import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewsSummaryComponent } from './news-summary.component';

describe('NewsComponent', () => {
  let component: NewsSummaryComponent;
  let fixture: ComponentFixture<NewsSummaryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NewsSummaryComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NewsSummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
