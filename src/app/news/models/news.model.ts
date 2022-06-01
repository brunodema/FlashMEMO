export class News {
  newsId: string = '';
  title: string = '';
  subtitle: string = '';
  thumbnailPath: string = '';
  content: string = '';
  creationDate: string = new Date().toISOString();
  lastUpdated: string = new Date().toISOString();

  public constructor(init?: Partial<News>) {
    Object.assign(this, init);
  }
}
