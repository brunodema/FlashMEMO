import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
  PaginatedListResponse,
  IPaginatedListResponse,
  IDataAPIResponse,
} from '../models/http/http-response-types';
import { environment } from 'src/environments/environment';
import { Observable, of } from 'rxjs';

/**
 * Simply amazing feature taken from here: https://stackoverflow.com/questions/49996456/importing-json-file-in-typescript. Allows json files to be directly imported as type-safe objects. Requires some changes to the tsconfig.json file.
 */
import imageAPIJson from 'src/assets/test_assets/ImageAPI.json';
import dictAPIJson from 'src/assets/test_assets/DictAPI.json';

/**************************************************************************************/
/* Image API stuff */
/**************************************************************************************/

/**
 * Dummy class for interfacing purposes. For the moment, will completly mimic the Google Image API return object.
 */
export interface IImageAPIResult {
  title: string;
  link: string;
  image: {
    byteSize: number;
    contextLink: string;
    height: number;
    thumbnailHeight: number;
    thumbnailLink: string;
    thumbnailWidth: number;
    width: number;
  };
}

/**
 * Image API implementation that uses the Google Custom Search web search provider.
 */
export class GoogleImageResult implements IImageAPIResult {
  public constructor(init?: Partial<GoogleImageResult>) {
    Object.assign(this, init);
  }
  title: string;
  link: string;
  image: {
    byteSize: number;
    contextLink: string;
    height: number;
    thumbnailHeight: number;
    thumbnailLink: string;
    thumbnailWidth: number;
    width: number;
  };
}

@Injectable()
export abstract class GeneralImageAPIService {
  constructor(protected httpClient: HttpClient) {}

  /**
   * Searches for images related to the provided keyword. Returns a IPaginatedListResponse<Type> response, containing information on the request itself, and of the returned data (page size/index, results themselves, etc).
   * @param keyword Word to be used for the search.
   */
  abstract searchImage(
    keyword: string,
    pageIndex: number
  ): Observable<IPaginatedListResponse<IImageAPIResult>>;
}

/**
 * Class for testing purposes only
 */
@Injectable()
export class MockImageAPIService extends GeneralImageAPIService {
  searchImage(
    keyword: string,
    pageIndex: number
  ): Observable<PaginatedListResponse<IImageAPIResult>> {
    return of(
      new PaginatedListResponse<GoogleImageResult>({
        message: 'Success',
        status: '200',
        data: {
          hasNextPage: pageIndex < 5,
          hasPreviousPage: pageIndex >= 2,
          pageIndex: pageIndex.toString(),
          totalAmount: '50',
          resultSize: '10',
          totalPages: '5',
          results: Array.from(
            { length: 10 },
            (_) => imageAPIJson[Math.floor(Math.random() * imageAPIJson.length)] // this crazyness here takes the data from the test json file, and 'scrambles' it into the results.
          ),
        },
      })
    );
  }
}

@Injectable()
export class ImageAPIService extends GeneralImageAPIService {
  private endpoint = `${environment.backendRootAddress}/api/v1/imageapi`;

  constructor(httpClient: HttpClient) {
    super(httpClient);
  }

  searchImage(
    keyword: string,
    pageIndex: number
  ): Observable<IPaginatedListResponse<GoogleImageResult>> {
    return this.httpClient.get<PaginatedListResponse<GoogleImageResult>>(
      `${this.endpoint}/search?searchText=${keyword}&pageNumber=${pageIndex}`
    );
  }
}

/**************************************************************************************/
/* Dictionary API stuff */
/**************************************************************************************/

/**
 * Contains the codes for the supported languages for each existing Dictionary API provider. These codes were taken from the back-end project (17/04/2022), which in turn were taken from the official documentation of the APIs. They might not reflect the most recent array of supported languages, as they are static values in the code files. This will need to either be used as a back-up option, or transitioned towards a full programatic check using HTTP requests.
 */
const dictAPISupportedLanguages = {
  Lexicala: [
    'af',
    'ar',
    'az',
    'bg',
    'br',
    'ca',
    'cs',
    'da',
    'de',
    'dk',
    'el',
    'en',
    'es',
    'et',
    'fa',
    'fi',
    'fr',
    'fy',
    'he',
    'hi',
    'hr',
    'hu',
    'id',
    'is',
    'it',
    'ja',
    'ko',
    'la',
    'lt',
    'lv',
    'ml',
    'nl',
    'no',
    'pl',
    'prs',
    'ps',
    'pt',
    'ro',
    'ru',
    'sk',
    'sl',
    'sr',
    'sv',
    'th',
    'tr',
    'tw',
    'uk',
    'ur',
    'vi',
    'zh',
  ],
  Oxford: ['en-gb', 'en-us', 'fr', 'gu', 'hi', 'lv', 'ro', 'es', 'sw', 'ta'],
};

/**
 * Enum used to show the provider options to the user ('Select' elements).
 */
export enum DictionaryAPIProvider {
  OXFORD = 'Oxford',
  LEXICALA = 'Lexicala',
}

/**
 * Interface containing the main properties returned by the dictionary APIs.
 */
export interface IDictionaryAPIResult {
  searchText: string;
  languageCode: string;
  results: {
    lexicalCategory: string;
    pronunciationFile: string;
    phoneticSpelling: string;
    definitions: string[];
    examples: string[];
  }[];
}
/**
 * Abstract class representing the expected behavior of the Dictionary API service.
 */
@Injectable()
export abstract class GeneralDictionaryAPIService {
  constructor(protected httpClient: HttpClient) {}

  abstract searchWord(
    keyword: string,
    languageCode: string
  ): Observable<IDataAPIResponse<IDictionaryAPIResult>>;

  protected checkIfLanguageIsSupported(
    provider: DictionaryAPIProvider,
    languageCode: string
  ): boolean {
    switch (provider) {
      case DictionaryAPIProvider.LEXICALA:
        return dictAPISupportedLanguages.Lexicala.includes(languageCode);
      case DictionaryAPIProvider.OXFORD:
        return dictAPISupportedLanguages.Oxford.includes(languageCode);

      default:
        throw new Error('The dictionary API provider selected does not exist.');
    }
  }

  public ParseResultsIntoHTML(apiResult: IDictionaryAPIResult): string {
    let htmlText: string = '';
    htmlText += `<p><b>${apiResult.searchText}</b></p>`; // append search word as 'headline'

    apiResult.results.forEach((r) => {
      // might include more than one 'result'
      htmlText += `<p>Category: ${r.lexicalCategory}</p><p>Spelling: ${r.phoneticSpelling}</p>`; // non-array properties
      htmlText += `<p>Definitions:</p>`;
      htmlText += '<ul>';
      r.definitions.forEach((d) => (htmlText += `<li>${d}</li>`)); // list with definitions
      htmlText += '</ul>';
      htmlText += `<p>Examples:</p>`;
      htmlText += '<ul>';
      r.examples.forEach((e) => (htmlText += `<li>${e}</li>`)); // list with examples
      htmlText += '</ul>';
    });

    return htmlText;
  }
}

/**
 * Class for testing purposes only
 */
@Injectable()
export class MockDictionaryService extends GeneralDictionaryAPIService {
  searchWord(
    keyword: string,
    languageCode: string
  ): Observable<IDataAPIResponse<IDictionaryAPIResult>> {
    return of({
      message: 'Success',
      status: '200',
      errors: [],
      data: dictAPIJson[Math.floor(Math.random() * dictAPIJson.length)],
    });
  }
}

// STILL MISSING THE ACTUAL IMPLEMENTATION OF THE DICTIONARY API. GOT TOO CURIOUS ABOUT AUDIO STUFF :p

/**************************************************************************************/
/* Dictionary API stuff */
/**************************************************************************************/

/**
 * It's a copy of the one used for the Dictionary API. This is still WIP, since the [REDACTED] API is still being developed (conceptually).
 */
const AudioAPISupportedLanguages = {
  Redacted: [''], // nothing for now
  Oxford: ['en-gb', 'en-us', 'fr', 'gu', 'hi', 'lv', 'ro', 'es', 'sw', 'ta'], // same as from the other ones, even though it seems that only 'en-gb' brings any results
};

/**
 * Enum used to show the provider options to the user ('Select' elements).
 */
export enum AudioAPIProvider {
  OXFORD = 'Oxford',
  REDACTED = '[REDACTED]',
}

/**
 * Interface containing the main properties returned by the audio APIs. It is meant to be a duplicate of the Dictionary API counterpart, but focusing on the associated audio files found.
 */
export interface IAudioAPIResult {
  searchText: string;
  languageCode: string;
  results: {
    audioFiles: string[];
  };
}

/**
 * Abstract class representing the expected behavior of the Audio API service.
 */
@Injectable()
export abstract class GeneralAudioAPIService {
  constructor(protected httpClient: HttpClient) {}

  abstract searchAudio(
    keyword: string,
    languageCode: string
  ): Observable<IDataAPIResponse<IAudioAPIResult>>;

  protected checkIfLanguageIsSupported(
    provider: AudioAPIProvider,
    languageCode: string
  ): boolean {
    switch (provider) {
      case AudioAPIProvider.OXFORD:
        return AudioAPISupportedLanguages.Oxford.includes(languageCode);
      case AudioAPIProvider.REDACTED:
        return AudioAPISupportedLanguages.Redacted.includes(languageCode); // shouldn't do anything for now

      default:
        throw new Error('The audio API provider selected does not exist.');
    }
  }

  public ParseResultsIntoHTML(apiResult: IDictionaryAPIResult): string {
    let htmlText: string = '';

    // WIP

    return htmlText;
  }
}

/**
 * Class for testing purposes only
 */
@Injectable()
export class MockAudioService extends GeneralAudioAPIService {
  searchAudio(
    keyword: string,
    languageCode: string
  ): Observable<IDataAPIResponse<IAudioAPIResult>> {
    return of({
      message: 'Success',
      status: '200',
      errors: [],
      data: {
        searchText: '',
        languageCode: '',
        results: {
          audioFiles: [],
        },
      },
    });
  }
}
