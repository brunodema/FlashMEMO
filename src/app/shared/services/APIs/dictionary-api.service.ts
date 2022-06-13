/**
 * Simply amazing feature taken from here: https://stackoverflow.com/questions/49996456/importing-json-file-in-typescript. Allows json files to be directly imported as type-safe objects. Requires some changes to the tsconfig.json file.
 */
import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { map, of } from 'rxjs';
import { Observable } from 'rxjs/internal/Observable';
import { RepositoryServiceConfig } from 'src/app/app.module';
import dictAPIJson from 'src/assets/test_assets/DictAPI.json';

import { IDataResponse } from '../../models/http/http-response-types';
import { Language } from '../../models/shared-models';
import { FormatString } from '../../tools/tools';

/**************************************************************************************/
/* Dictionary API stuff */
/**************************************************************************************/

/**
 * As of now (13/06), these values are used for testing only - some of them aren't even valid anymore.
 */

export const dictAPISupportedLanguages = {
  Lexicala: [
    { isoCode: 'ar', name: 'Arabic' },
    { isoCode: 'br', name: 'Portuguese (BR)' },
    { isoCode: 'cs', name: 'Czech' },
  ],
  Oxford: [
    { isoCode: 'en-gb', name: 'English (UK)' },
    { isoCode: 'en-us', name: 'English (US)' },
    { isoCode: 'fr', name: 'French' },
  ],
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

  abstract getAvailableLanguages(
    provider: DictionaryAPIProvider
  ): Observable<Language[]>;

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

  getAvailableLanguages(
    provider: DictionaryAPIProvider
  ): Observable<Language[]> {
    switch (provider) {
      case DictionaryAPIProvider.LEXICALA:
        return of(dictAPISupportedLanguages.Lexicala);
      case DictionaryAPIProvider.OXFORD:
        return of(dictAPISupportedLanguages.Oxford);

      default:
        throw new Error('The dictionary API provider selected does not exist.');
    }
  }
}

@Injectable()
export class DictionaryService extends GeneralDictionaryAPIService {
  private endpoint = `${this.config.backendAddress}/api/v1/dict`;

  constructor(
    @Inject('REPOSITORY_SERVICE_CONFIG')
    protected config: RepositoryServiceConfig,
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
      FormatString(`${this.endpoint}/{0}/search?`, provider) +
        `searchText=${keyword}&languageCode=${languageCode}`
    );
  }

  getAvailableLanguages(
    provider: DictionaryAPIProvider
  ): Observable<Language[]> {
    return this.httpClient
      .get<IDataResponse<Language[]>>(
        FormatString(`${this.endpoint}/{0}/languages`, provider)
      )
      .pipe(map((response) => response.data));
  }
}
