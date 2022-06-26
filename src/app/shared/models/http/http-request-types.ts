export interface ILoginRequest {
  username: string;
  password: string;
}

export interface IRefreshRequest {
  expiredAccessToken: string;
}

export interface IRegisterRequest {
  username: string;
  name: string;
  surname: string;
  email: string;
  password: string;
}
