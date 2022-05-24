import { HttpClientModule } from '@angular/common/http';
import { TestBed, waitForAsync, ComponentFixture } from '@angular/core/testing';
import {
  ActivatedRoute,
  convertToParamMap,
  Resolve,
  Router,
  RouterStateSnapshot,
} from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { JwtModule } from '@auth0/angular-jwt';
import {
  NgbAccordionModule,
  NgbModalModule,
  NgbTooltipModule,
} from '@ng-bootstrap/ng-bootstrap';
import { FormlyModule } from '@ngx-formly/core';
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
  GenericDeckService,
  MockDeckService,
} from '../../services/deck.service';
import { DeckDetailComponent } from './deck-detail.component';
import { formlyConfig } from 'src/app/app.module';
import { FormsModule } from '@angular/forms';
import { FormlyMaterialModule } from '@ngx-formly/material';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { Deck } from '../../models/deck.model';
import { SharedModule } from 'src/app/shared/shared.module';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { By } from '@angular/platform-browser';

// main template taken from here: https://www.testim.io/blog/angular-component-testing-detailed-guide/
// had to manually import the testing module from here: https://angular.io/api/router/testing/RouterTestingModule
// some refactorings taken from here: https://blog.logrocket.com/angular-unit-testing-tutorial-examples/

describe('DeckDetailComponent', () => {
  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [DeckDetailComponent],
      schemas: [NO_ERRORS_SCHEMA],
      imports: [
        SharedModule,
        FormlyModule.forRoot(formlyConfig),
        FormlyMaterialModule,
        BrowserAnimationsModule,
        NgbTooltipModule,
        FormsModule,
        NgbAccordionModule,
        NgbModalModule,
        RouterTestingModule.withRoutes([
          {
            path: ':id',
            component: DeckDetailComponent,
            resolve: { deck: DeckRepositoryResolverService },
          },
        ]),
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
              paramMap: convertToParamMap({
                id: 'E5B4BB88-F528-7535-F9BE-D9F11BE3DB54',
              }),
              data: {},
            },
          },
        },
      ],
    }).compileComponents();
  }));

  let fixture: ComponentFixture<DeckDetailComponent>;
  let component: DeckDetailComponent;
  let route: ActivatedRoute;
  let router: Router;
  let resolver: Resolve<Deck>;

  beforeEach(() => {
    route = TestBed.inject(ActivatedRoute);
    router = TestBed.inject(Router);
    resolver = TestBed.inject(DeckRepositoryResolverService);
    fixture = TestBed.createComponent(DeckDetailComponent);
    component = fixture.debugElement.componentInstance;

    route.snapshot.data = resolver.resolve(
      route.snapshot,
      router.routerState.snapshot
    );
    fixture.detectChanges();
  });

  it('should create the app', async () => {
    expect(component).toBeTruthy();
    console.log(JSON.stringify(route));

    fixture.whenStable().then(() => {
      console.log('fixture is now stable.');
      console.log(fixture.debugElement.query(By.css('ms-2')));
    });
  });
});
