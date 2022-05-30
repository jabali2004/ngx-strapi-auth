export interface IStrapiLoginError {
  details: object;
  message: string;
  name: string;
  status: number;
}

export interface IResAuthLoginError {
  data: object;
  error: IStrapiLoginError;
}
