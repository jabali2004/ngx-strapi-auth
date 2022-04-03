import { User } from '../models/User';

export interface IResAuthLogin {
  jwt: string;
  user: User;
}
