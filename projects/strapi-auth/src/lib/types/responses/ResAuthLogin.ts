import type { User } from '../models/User';

export interface IResAuthLogin {
  jwt: string;
  user: User;
}
