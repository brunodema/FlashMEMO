import { News } from '../models/news.model';

export interface NewsListResponseModel {
  newsList: News[];
  status: string;
  message: string;
  errors: [];
}
