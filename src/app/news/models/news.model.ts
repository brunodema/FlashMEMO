export class News {
  newsID: string = '';
  title: string = '';
  subtitle: string = '';
  content: string = '';
  thumbnailPath: string = '';
  creationDate: number = Date.now();
  lastUpdated: number = Date.now();

  constructor() {}
}
