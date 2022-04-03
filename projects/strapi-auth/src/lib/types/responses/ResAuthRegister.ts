import { User } from '../models/User';

export interface IResAuthRegister {
  jwt: string;
  user: User;
}
