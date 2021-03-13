import { UserDTO } from './UserDTO';

export interface IResPasswordReset {
  jwt: string;
  user: UserDTO;
}
