import { Guid } from 'guid-ts';

export class User {
  id: string = Guid.newGuid().toString();
  name: string = '';
  surname: string = '';
  username: string = '';
  email: string = '';
  lastLogin?: string = undefined;

  public constructor(init?: Partial<User>) {
    Object.assign(this, init);
  }
}
