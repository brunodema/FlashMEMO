import { DeckService } from 'src/app/deck/services/deck.service';
import { NewsService } from 'src/app/news/services/news.service';
import { AudioService } from 'src/app/shared/services/APIs/audio-api.service';
import { DictionaryService } from 'src/app/shared/services/APIs/dictionary-api.service';
import { ImageAPIService } from 'src/app/shared/services/APIs/image-api.service';
import { AuthService } from 'src/app/shared/services/auth.service';
import { FlashcardService } from 'src/app/shared/services/flashcard.service';
import { LanguageService } from 'src/app/shared/services/language.service';
import { IFlashMEMOLoggerOptions } from 'src/app/shared/services/logging/logger.service';
import { UserStatsService } from 'src/app/shared/services/user-stats.service';
import { UserService } from 'src/app/user/services/user.service';

export const environment = {
  production: false,
  backendRootAddress: 'http://api.flashmemo.edu:5000',
  maxPageSize: 10000,
  defaultLanguageISOCode: 'en-gb',
  // cookies
  expirationPeriod: 90, // days
  // services
  newsService: NewsService,
  userService: UserService,
  deckService: DeckService,
  flashcardService: FlashcardService,
  authService: AuthService,
  languageService: LanguageService,
  imageAPIService: ImageAPIService,
  audioAPIService: AudioService,
  dictionaryAPIService: DictionaryService,
  userStatsService: UserStatsService,
  // logging
  loggerConfig: {
    logLevel: 'DEBUG',
    provider: 'CONSOLE',
  } as IFlashMEMOLoggerOptions,
};
