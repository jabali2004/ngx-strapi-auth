export interface IStrapiError {
  details: object;
  message: string;
  name: string;
  status: number;
}

export interface IErrorRes {
  data: object;
  error: IStrapiError;
}
