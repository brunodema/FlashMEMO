export class User {
  id: string;
  name: string;
  surname: string;
  username: string;
  email: string;

  public constructor(init?: Partial<User>) {
    Object.assign(this, init);
  }
}
