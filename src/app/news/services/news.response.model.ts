import { News } from '../models/news.model';

export interface NewsListResponseModel {
  errors: string[];
  message: string;
  news: News[]; // name must match with the returned object (lesson learned)
  status: string;
}
