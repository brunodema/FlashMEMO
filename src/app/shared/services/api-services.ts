import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
  PaginatedListResponse,
  IPaginatedListResponse,
} from '../models/http/response-interfaces';

/**
 * Dummy class for testing purposes.
 */
export interface IImageAPIResult {}

export class GoogleImageResult implements IImageAPIResult {
  title: string;
  link: string;
  image = new (class {
    byteSize: number;
    contextLink: string;
    height: number;
    thumbnailHeight: number;
    thumbnailLink: string;
    thumbnailWidth: number;
    width: number;
  })();
}

@Injectable()
export abstract class GeneralImageAPIService {
  constructor(
    protected endpointURL: String,
    protected httpClient: HttpClient
  ) {}

  /**
   * Searches for images related to the provided keyword. Returns a IPaginatedListResponse<Type> response, containing information on the request itself, and of the returned data (page size/index, results themselves, etc).
   * @param keyword Word to be used for the search.
   */
  abstract searchImage(
    keyword: String
  ): IPaginatedListResponse<IImageAPIResult>;
}

export class MockImageAPIService extends GeneralImageAPIService {
  searchImage(keyword: String): PaginatedListResponse<IImageAPIResult> {
    return new PaginatedListResponse<GoogleImageResult>({
      message: 'Success',
      status: '200',
      data: {
        hasNextPage: false,
        hasPreviousPage: false,
        pageIndex: '1',
        totalAmount: '2',
        resultSize: '2',
        totalPages: '1',
        results: [
          {
            title:
              'L.O.L. Surprise! L.O.L. Surprise OMG Sports Doll- Cheer 577508 ...',
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
            link: 'https://pisces.bbystatic.com/image2/BestBuy_US/images/products/6463/6463576_sd.jpg',
          },
          {
            title:
              'How L.O.L. Dolls Became the Dopamine Hit of a Generation - The New ...',
            image: {
              byteSize: 553409,
              contextLink:
                'https://www.nytimes.com/2020/04/16/parenting/lol-surprise-doll-isaac-larian.html',
              height: 1200,
              thumbnailHeight: 100,
              thumbnailLink:
                'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS8OfjT1pLQpy-wkPfTn0vKyTHcVMR005he34rKpZt0XKQJ3VOa88Tc3wk&s',
              thumbnailWidth: 150,
              width: 1800,
            },
            link: 'https://static01.nyt.com/images/2019/12/17/multimedia/17-parenting-LOL1/merlin_165750795_642b4b50-77fd-4ba8-8a78-1ba763e3cd7a-mobileMasterAt3x.jpg',
          },
        ],
      },
    });
  }
}
