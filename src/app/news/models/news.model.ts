export class News {
  newsID: string = '';
  title: string = '';
  subtitle: string = '';
  thumbnailPath: string = '';
  content: string = '';
  creationDate: number = Date.now();
  lastUpdated: number = Date.now();

  constructor() {}
}
