/**
 * Simply amazing feature taken from here: https://stackoverflow.com/questions/49996456/importing-json-file-in-typescript. Allows json files to be directly imported as type-safe objects. Requires some changes to the tsconfig.json file.
 */
import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { of } from 'rxjs';
import { Observable } from 'rxjs/internal/Observable';
import { RepositoryServiceConfig } from 'src/app/app.module';
import AudioAPIJson from 'src/assets/test_assets/AudioAPI.json';
import { IDataResponse } from '../../models/http/http-response-types';

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
  REDACTED = 'REDACTED',
  OXFORD = 'Oxford',
}

/**
 * Interface containing the main properties returned by the audio APIs. It is meant to be a duplicate of the Dictionary API counterpart, but focusing on the associated audio files found.
 */
export interface IAudioAPIResult {
  searchText: string;
  languageCode: string;
  results: {
    audioLinks: string[];
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
    languageCode: string,
    provider: AudioAPIProvider
  ): Observable<IDataResponse<IAudioAPIResult>>;

  protected checkIfLanguageIsSupported(
    provider: AudioAPIProvider,
    languageCode: string
  ): boolean {
    switch (provider) {
      case AudioAPIProvider.OXFORD:
        return AudioAPISupportedLanguages.Oxford.includes(languageCode);
      case AudioAPIProvider.REDACTED:
        return true; // shouldn't do anything for now

      default:
        throw new Error('The audio API provider selected does not exist.');
    }
  }
}

/**
 * Class for testing purposes only
 */
@Injectable()
export class MockAudioService extends GeneralAudioAPIService {
  searchAudio(
    keyword: string,
    languageCode: string,
    provider: AudioAPIProvider
  ): Observable<IDataResponse<IAudioAPIResult>> {
    return of({
      message: 'Success',
      status: '200',
      errors: [],
      data: AudioAPIJson[Math.floor(Math.random() * AudioAPIJson.length)],
    });
  }
}

@Injectable()
export class AudioService extends GeneralAudioAPIService {
  private endpoint = `${this.config.backendAddress}/api/v1/redactedapi/search?`;

  constructor(
    @Inject('REPOSITORY_SERVICE_CONFIG')
    protected config: RepositoryServiceConfig,
    protected httpClient: HttpClient
  ) {
    super(httpClient);
  }

  searchAudio(
    keyword: string,
    languageCode: string,
    provider: AudioAPIProvider
  ): Observable<IDataResponse<IAudioAPIResult>> {
    return this.httpClient.get<IDataResponse<IAudioAPIResult>>(
      this.endpoint +
        `keyword=${keyword}&languageCode=${languageCode}&provider=${provider}`
    );
  }
}
