import type { User } from '../models/User';

export interface IResPasswordReset {
  jwt: string;
  user: User;
}
