import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
  PaginatedListResponse,
  IPaginatedListResponse,
} from '../models/http/http-response-types';

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
  ): IPaginatedListResponse<IImageAPIResult>;
}

/**
 * Class for prototyping purposes only
 */
export class MockImageAPIService extends GeneralImageAPIService {
  dummyImage: GoogleImageResult = new GoogleImageResult({
    title: 'L.O.L. Surprise! L.O.L. Surprise OMG Sports Doll- Cheer 577508 ...',
    link: 'https://pisces.bbystatic.com/image2/BestBuy_US/images/products/6463/6463576_sd.jpg',
    image: {
      byteSize: 807147,
      contextLink:
        'https://www.bestbuy.com/site/l-o-l-surprise-l-o-l-surprise-omg-sports-doll-cheer/6463576.p?skuId=6463576',
      height: 4409,
      thumbnailHeight: 150,
      thumbnailLink:
        'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQcdFWm87QgFJzd0aqHu9r1Lg01S7ca7-_0ijLbfm7ddj-eVcpd1BfbHWU&s',
      thumbnailWidth: 112,
      width: 3306,
    },
  });

  searchImage(
    keyword: string,
    pageIndex: number
  ): PaginatedListResponse<IImageAPIResult> {
    return new PaginatedListResponse<GoogleImageResult>({
      message: 'Success',
      status: '200',
      data: {
        hasNextPage: pageIndex < 1000,
        hasPreviousPage: pageIndex > 2,
        pageIndex: pageIndex.toString(),
        totalAmount: '10000',
        resultSize: '10',
        totalPages: '1000',
        results: new Array(10).fill(this.dummyImage),
      },
    });
  }
}
