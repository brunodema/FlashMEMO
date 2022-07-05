// this 'mock' environment should be used for e2e tests. It pretty much represents the production configurations, but using Mock services instead.

import { MockDeckService } from 'src/app/deck/services/deck.service';
import { MockNewsService } from 'src/app/news/services/news.service';
import { MockAudioService } from 'src/app/shared/services/APIs/audio-api.service';
import { MockDictionaryService } from 'src/app/shared/services/APIs/dictionary-api.service';
import { MockImageAPIService } from 'src/app/shared/services/APIs/image-api.service';
import { MockAuthService } from 'src/app/shared/services/auth.service';
import { MockFlashcardService } from 'src/app/shared/services/flashcard.service';
import { MockLanguageService } from 'src/app/shared/services/language.service';
import { IFlashMEMOLoggerOptions } from 'src/app/shared/services/logging/logger.service';
import { MockUserStatsService } from 'src/app/shared/services/user-stats.service';
import { MockUserService } from 'src/app/user/services/user.service';

export const environment = {
  production: true,
  backendRootAddress: 'http://api.flashmemo.edu:5000',
  maxPageSize: 10000,
  defaultLanguageISOCode: 'en-gb',
  // cookies
  expirationPeriod: 90, // days
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
  userStatsService: MockUserStatsService,
  // logging
  loggerConfig: {
    logLevel: 'INFORMATION',
    provider: 'CONSOLE',
  } as IFlashMEMOLoggerOptions,
};
