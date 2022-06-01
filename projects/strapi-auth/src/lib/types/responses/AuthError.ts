export interface IStrapiError {
  details: object;
  message: string;
  name: string;
  status: number;
}

export interface IAuthError {
  data: object;
  error: IStrapiError;
}
