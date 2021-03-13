import { UserDTO } from './UserDTO';

export interface IResAuthLogin {
  jwt: string;
  user: UserDTO;
}
