import { HttpClientModule } from '@angular/common/http';
import {
  TestBed,
  async,
  waitForAsync,
  ComponentFixture,
  inject,
} from '@angular/core/testing';
import { ActivatedRoute, convertToParamMap, Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { JwtHelperService, JwtModule } from '@auth0/angular-jwt';
import {
  NgbAccordionModule,
  NgbModalModule,
  NgbTooltip,
  NgbTooltipModule,
} from '@ng-bootstrap/ng-bootstrap';
import { FormlyModule } from '@ngx-formly/core';
import { Observable, of } from 'rxjs';
import { DeckRepositoryResolverService } from 'src/app/shared/resolvers/generic-repository.resolver';
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
  DeckService,
  GenericDeckService,
  MockDeckService,
} from '../../services/deck.service';
import { DeckDetailComponent } from './deck-detail.component';
import { formlyConfig } from 'src/app/app.module';
import { FormsModule } from '@angular/forms';
import { FormlyMaterialModule } from '@ngx-formly/material';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { Deck } from '../../models/deck.model';

// main template taken from here: https://www.testim.io/blog/angular-component-testing-detailed-guide/
// had to manually import the testing module from here: https://angular.io/api/router/testing/RouterTestingModule
// some refactorings taken from here: https://blog.logrocket.com/angular-unit-testing-tutorial-examples/

describe('DeckDetailComponent', () => {
  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [DeckDetailComponent],
      imports: [
        FormlyModule.forRoot(formlyConfig),
        FormlyMaterialModule,
        BrowserAnimationsModule,
        NgbTooltipModule,
        FormsModule,
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
        GenericNotificationService,
        DeckRepositoryResolverService,
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              params: of([{ id: 1 }]),
              data: { deck: new Deck({deckId: 'dsddsdfdf'}) }
            },
          }
        },
      ],
    }).compileComponents();
  }));

  let fixture: ComponentFixture<DeckDetailComponent>;
  let component: DeckDetailComponent;
  let route: ActivatedRoute;

  beforeEach(() => {
    fixture = TestBed.createComponent(DeckDetailComponent);
    route = TestBed.inject(ActivatedRoute);
    component = fixture.debugElement.componentInstance;
  });

  it('should create the app', () => {
    expect(component).toBeTruthy();
    console.log(component.deckModel);
  });

  it('should work :p', () => {});
});
