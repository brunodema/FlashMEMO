import { News } from 'src/app/news/models/news.model';
import { SortType } from './sort-type';

export class SortOptions {
  static getComparisonFunction<News>(sortType: SortType) {
    switch (sortType) {
      case SortType.ASCENDING:
        return sortAscending;
      case SortType.DESCENDING:
        return sortDescending;
      default:
        return undefined;
    }
  }
}

export const sortAscending = (a: News, b: News) =>
  a.creationDate - b.creationDate;
export const sortDescending = (a: News, b: News) =>
  b.creationDate - a.creationDate;
