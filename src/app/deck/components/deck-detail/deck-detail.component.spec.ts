import { HttpClientModule } from '@angular/common/http';
import { TestBed, async, waitForAsync } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { JwtHelperService, JwtModule } from '@auth0/angular-jwt';
import { NgbAccordionModule, NgbModalModule } from '@ng-bootstrap/ng-bootstrap';
import {
  GenericAuthService,
  MockAuthService,
} from 'src/app/shared/services/auth.service';
import {
  GenericFlashcardService,
  MockFlashcardService,
} from 'src/app/shared/services/flashcard.service';
import {
  GenericLanguageService,
  MockLanguageService,
} from 'src/app/shared/services/language.service';
import { GenericNotificationService } from 'src/app/shared/services/notification/notification.service';
import {
  GenericDeckService,
  MockDeckService,
} from '../../services/deck.service';
import { DeckDetailComponent } from './deck-detail.component';

// main template taken from here: https://www.testim.io/blog/angular-component-testing-detailed-guide/
// had to manually import the testing module from here: https://angular.io/api/router/testing/RouterTestingModule

describe('DeckDetailComponent', () => {
  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [DeckDetailComponent],
      imports: [
        NgbAccordionModule,
        NgbModalModule,
        RouterTestingModule,
        HttpClientModule,
        JwtModule.forRoot({
          config: {
            tokenGetter: () => {
              return localStorage.getItem('token');
            },
          },
        }),
      ],
      providers: [
        { provide: GenericLanguageService, useClass: MockLanguageService },
        { provide: GenericFlashcardService, useClass: MockFlashcardService },
        { provide: GenericDeckService, useClass: MockDeckService },
        { provide: GenericAuthService, useClass: MockAuthService },
        // JwtHelperService,
        GenericNotificationService,
      ],
    }).compileComponents();
  }));

  it('should create the app', () => {
    const fixture = TestBed.createComponent(DeckDetailComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app).toBeTruthy();
  });
});
