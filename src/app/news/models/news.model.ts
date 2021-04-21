export class News {
  title: string = "";
  subtitle: string = "";
  thumbnailPath: string = "";
  creationDate : number = Date.now();
  lastUpdated : number = Date.now();
  content: string = "";


  constructor() {}
}
