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

export interface IServerLoggingRequest {
  logLevel: number;
  message: number;
  fileName: string;
  columnNumber: number;
  lineNumber: number;
  timestamp: string;
  args: any[];
}
