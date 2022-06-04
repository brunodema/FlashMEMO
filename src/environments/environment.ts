// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

import { MockDeckService } from 'src/app/deck/services/deck.service';
import { MockNewsService } from 'src/app/news/services/news.service';
import { MockAudioService } from 'src/app/shared/services/APIs/audio-api.service';
import { MockDictionaryService } from 'src/app/shared/services/APIs/dictionary-api.service';
import { MockImageAPIService } from 'src/app/shared/services/APIs/image-api.service';
import { MockAuthService } from 'src/app/shared/services/auth.service';
import { MockFlashcardService } from 'src/app/shared/services/flashcard.service';
import { MockLanguageService } from 'src/app/shared/services/language.service';
import { MockUserService } from 'src/app/user/services/user.service';

export const environment = {
  production: false,
  // backendRootAddress: 'http://localhost:3000',
  backendRootAddress: 'http://api.flashmemo.edu:5000',
  maxPageSize: 10000,
  defaultLanguageISOCode: 'en-gb',
  // services
  newsService: MockNewsService,
  userService: MockUserService,
  deckService: MockDeckService,
  flashcardService: MockFlashcardService,
  authService: MockAuthService,
  languageService: MockLanguageService,
  imageAPIService: MockImageAPIService,
  audioAPIService: MockAudioService,
  dictionaryAPIService: MockDictionaryService,
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
