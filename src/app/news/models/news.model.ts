import { User } from 'src/app/user/models/user.model';

export class News {
  newsId: string = '';
  ownerId: string = '';
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

export class ExtendedNews extends News {
  ownerInfo: User = new User();

  public constructor(init?: Partial<ExtendedNews>) {
    super();
    Object.assign(this, init);
  }
}
