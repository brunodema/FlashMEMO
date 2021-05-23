export interface BaseAPIResponseModel {
  status: string;
  message: string;
  errors: any[];
}

export interface LoginRequestModel {
  email: string;
  password: string;
}

export interface RegisterRequestModel {
  name: string;
  surname: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface LoginResponseModel extends BaseAPIResponseModel {
  jwtToken: string;
}
