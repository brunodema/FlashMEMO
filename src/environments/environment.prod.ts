import { DeckService } from 'src/app/deck/services/deck.service';
import { NewsService } from 'src/app/news/services/news.service';
import { AudioService } from 'src/app/shared/services/APIs/audio-api.service';
import { DictionaryService } from 'src/app/shared/services/APIs/dictionary-api.service';
import { ImageAPIService } from 'src/app/shared/services/APIs/image-api.service';
import { AuthService } from 'src/app/shared/services/auth.service';
import { FlashcardService } from 'src/app/shared/services/flashcard.service';
import { LanguageService } from 'src/app/shared/services/language.service';
import { UserService } from 'src/app/user/services/user.service';

export const environment = {
  production: true,
  backendRootAddress: 'https://backend-svc.default:443',
  maxPageSize: 10000,
  defaultLanguageISOCode: 'en-gb',
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
};
