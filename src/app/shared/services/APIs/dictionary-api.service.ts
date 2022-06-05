/**
 * Simply amazing feature taken from here: https://stackoverflow.com/questions/49996456/importing-json-file-in-typescript. Allows json files to be directly imported as type-safe objects. Requires some changes to the tsconfig.json file.
 */
import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { of } from 'rxjs';
import { Observable } from 'rxjs/internal/Observable';
import { RepositoryServiceConfig } from 'src/app/app.module';
import dictAPIJson from 'src/assets/test_assets/DictAPI.json';

import { IDataResponse } from '../../models/http/http-response-types';
import { FormatString } from '../../tools/tools';

/**************************************************************************************/
/* Dictionary API stuff */
/**************************************************************************************/

/**
 * Contains the codes for the supported languages for each existing Dictionary API provider. These codes were taken from the back-end project (17/04/2022), which in turn were taken from the official documentation of the APIs. They might not reflect the most recent array of supported languages, as they are static values in the code files. This will need to either be used as a back-up option, or transitioned towards a full programatic check using HTTP requests.
 */
export const dictAPISupportedLanguages = {
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
    languageCode: string,
    provider: DictionaryAPIProvider
  ): Observable<IDataResponse<IDictionaryAPIResult>>;

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
  ): Observable<IDataResponse<IDictionaryAPIResult>> {
    return of({
      message: 'Success',
      status: '200',
      errors: [],
      data: dictAPIJson[Math.floor(Math.random() * dictAPIJson.length)],
    });
  }
}

@Injectable()
export class DictionaryService extends GeneralDictionaryAPIService {
  private endpoint = `${this.config.backendAddress}/api/v1/dict/{0}/search?`;

  constructor(
    @Inject('REPOSITORY_SERVICE_CONFIG') protected config: RepositoryServiceConfig,
    protected httpClient: HttpClient
  ) {
    super(httpClient);
  }
  searchWord(
    keyword: string,
    languageCode: string,
    provider: DictionaryAPIProvider
  ): Observable<IDataResponse<IDictionaryAPIResult>> {
    return this.httpClient.get<IDataResponse<IDictionaryAPIResult>>(
      FormatString(this.endpoint, provider) +
        `searchText=${keyword}&languageCode=${languageCode}`
    );
  }
}
