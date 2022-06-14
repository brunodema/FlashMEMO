/**
 * Simply amazing feature taken from here: https://stackoverflow.com/questions/49996456/importing-json-file-in-typescript. Allows json files to be directly imported as type-safe objects. Requires some changes to the tsconfig.json file.
 */
import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { RepositoryServiceConfig } from 'src/app/app.module';
import imageAPIJson from 'src/assets/test_assets/ImageAPI.json';
import {
  IPaginatedListResponse,
  PaginatedListResponse,
} from '../../models/http/http-response-types';

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
    pageNumber: number
  ): Observable<IPaginatedListResponse<IImageAPIResult>>;
}

/**
 * Class for testing purposes only
 */
@Injectable()
export class MockImageAPIService extends GeneralImageAPIService {
  searchImage(
    keyword: string,
    pageNumber: number
  ): Observable<PaginatedListResponse<IImageAPIResult>> {
    return of(
      new PaginatedListResponse<GoogleImageResult>({
        message: 'Success',
        data: {
          hasNextPage: pageNumber < 5,
          hasPreviousPage: pageNumber >= 2,
          pageNumber: pageNumber.toString(),
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
  private endpoint = `${this.config.backendAddress}/api/v1/imageapi`;

  constructor(
    @Inject('REPOSITORY_SERVICE_CONFIG')
    protected config: RepositoryServiceConfig,
    httpClient: HttpClient
  ) {
    super(httpClient);
  }

  searchImage(
    keyword: string,
    pageNumber: number
  ): Observable<IPaginatedListResponse<GoogleImageResult>> {
    return this.httpClient.get<PaginatedListResponse<GoogleImageResult>>(
      `${this.endpoint}/search?searchText=${keyword}&pageNumber=${pageNumber}`
    );
  }
}
