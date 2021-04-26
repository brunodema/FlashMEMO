import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewsCardComponent } from './news-card.component';

describe('NewsCardComponent', () => {
  let component: NewsCardComponent;
  let fixture: ComponentFixture<NewsCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [NewsCardComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NewsCardComponent);
    component = fixture.componentInstance;
    component.news = {
      title: 'Lorem Ipsum5',
      subtitle:
        'Consequat enim dolore cillum est veniam magna minim ipsum velit. Enim tempor pariatur elit dolore irure irure minim amet do est id. Deserunt minim nisi ut fugiat eu deserunt. Officia ut aliqua officia dolore occaecat excepteur duis. Consectetur sint duis duis laboris elit duis et labore culpa eu officia. Cillum quis quis voluptate amet elit veniam quis tempor est duis ipsum laboris. Dolor irure Lorem sunt ut voluptate. Tempor eiusmod eiusmod duis occaecat exercitation nisi occaecat officia ex ex enim sit voluptate non.',
      thumbnailPath: 'assets/FlashmemoLogo.png',
      creationDate: 1619040737679,
      lastUpdated: 1619040737679,
      content:
        'Lorem Ipsum lorem ipsum lorem ipsum Lorem Ipsum lorem ipsum lorem ipsum Lorem Ipsum lorem ipsum lorem ipsum Lorem Ipsum lorem ipsum lorem ipsum Lorem Ipsum lorem ipsum lorem ipsum',
    };
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
