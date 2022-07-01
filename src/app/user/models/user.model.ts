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

export class UserWithDeckData extends User {
  deckCount: number = 0;
  flashcardCount: number = 0;
  dueFlashcardCount: number = 0;
  dueDeckCount: number = 0;
  lastStudySession?: string = new Date(0).toISOString();

  public constructor(init?: Partial<UserWithDeckData>) {
    super();
    Object.assign(this, init);
  }
}
