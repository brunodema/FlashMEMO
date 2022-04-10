import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable()
export abstract class GeneralImageAPIService {
  constructor(
    protected endpointURL: String,
    protected httpClient: HttpClient
  ) {}

  abstract searchImage(keyword: String): String;
}

export class MockImageAPIService extends GeneralImageAPIService {
  searchImage(keyword: String): String {
    return 'https://www.freecodecamp.org/portuguese/news/content/images/2022/03/Untitled-design--1-.png'; // returns some random wachy image
  }
}
